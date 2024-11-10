

import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CategoriaDTO } from '../../Core/models/CategoriaDTO';
import { CategoriasService } from '../../Core/services/categorias.service';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl, MatPaginatorModule} from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { RouterLink } from '@angular/router';
import { NormasService } from '../../Core/services/normas.service';
import { TipodocumentoService } from '../../Core/services/tipodocumento.service';
import { DoctocsService } from '../../Core/services/doctocs.service';
import { FiltroVerticalService } from '../../Core/services/filtro-vertical.service';
import { ClasificacionesService } from '../../Core/services/clasificaciones.service';
import { TipodocumentoDTO } from '../../Core/models/TipodocumentoDTO';
import { DoctocDTO } from '../../Core/models/DoctocDTO';
import { ClasificacionDTO } from '../../Core/models/ClasificacionDTO';
import { MatSelectModule } from '@angular/material/select';
import { ArchivoDTO, FiltroVerticalGetDTO, FiltroVerticalGetExtendidaDTO } from '../../Core/models/FiltroVerticalGetDTO';
import { CustomMatPaginatorIntlComponent } from '../../Core/components/custom-mat-paginator-intl/custom-mat-paginator-intl.component';
import { PdfViewerComponent } from '../../Core/components/pdf-viewer/pdf-viewer.component';
import { MatDialog } from '@angular/material/dialog';
import { DocumentosService } from '../../Core/services/documentos.service';
import { DoctosModalComponent } from '../../Core/components/doctos-modal/doctos-modal.component';
import { OficinaDTO } from '../../Core/models/OficinaDTO';
import { OficinasService } from '../../Core/services/oficinas.service';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-filtro-vertical',
  standalone: true,
  imports: [MatButtonModule, RouterLink,  MatFormFieldModule, MatSelectModule, ReactiveFormsModule, MatInputModule, MatTableModule, MatPaginatorModule, MatIconModule, FormsModule, MatTooltipModule],
  templateUrl: './filtro-vertical.component.html',
  styleUrl: './filtro-vertical.component.css',
  providers: [
    { provide: MatPaginatorIntl, useClass: CustomMatPaginatorIntlComponent }
  ]
})
export class FiltroVerticalComponent {

  private dialog = inject(MatDialog); // Usa inject en lugar del constructor


  filtroVerticalService = inject(FiltroVerticalService);
  normasService = inject(NormasService);
  tipodocumentoService = inject(TipodocumentoService);
  categoriasService = inject(CategoriasService);
  oficinasService = inject(OficinasService);
  doctocsService = inject(DoctocsService);
  clasificacionesService = inject(ClasificacionesService);
  documentosService = inject(DocumentosService);


  
  listaNormas! : CategoriaDTO[];
  listaTipoDocumentos! : TipodocumentoDTO[];
  listaDocumentos! : FiltroVerticalGetDTO[];
  listaCategorias! : CategoriaDTO[];
  listaOficinas! : OficinaDTO[];
  listaDoctos! : DoctocDTO[];
  listaClasificaciones!: ClasificacionDTO[];



  listCategoriasdataSource = new MatTableDataSource<FiltroVerticalGetExtendidaDTO>([]);
  displayedColumns: string[] = [ 'acciones', 'categoria', 'tipo', 'norma', 'codigo', 'documento', 'version', 'oficina', 'docto', 'clasi', 'vigencia', 'carpetaRelaciones' ];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  textoBuscar: string = "";
  estaEditando: boolean = false;
  categoriaSeleccionada!: CategoriaDTO | null;





  ngOnInit(): void {

    this.obtenerCategoriasCargarTabla();

    this.obtenerDocumentos();

    this.obtenerTipoDocumentos();
    this.obtenerCategorias();
    this.obtenerNormas();
    this.obtenerOficinas();
    this.obtenerClasificaciones();
    this.obtenerDoctos();

    this.formulario.updateValueAndValidity();
  }
  
  constructor(){}

  private formbuilder = inject(FormBuilder);
  
  formulario = this.formbuilder.group({
    asunto: ['', [Validators.required]],
    codigo: ['', [Validators.required]],
    version: ['', [Validators.required]],
    normaID: [0, [Validators.required]],
    tipoDocumento: [0, [Validators.required]],
    categoriaID: [0, [Validators.required]],
    oficinaID: [0, [Validators.required]],
    doctoID: [0,  [Validators.required]],
    clasificacionID: [0,  [Validators.required]],
    palabraClave: ['', [Validators.required]]

  });



  //CRUD *******************************************************************************
  
  obtenerDocumentos(){
    this.filtroVerticalService.obtenerFiltroVertical().subscribe(response => {
      this.listaDocumentos = response;
      console.log(this.listaDocumentos);
    });
  }

  obtenerCategoriaPorId(idBuscar:number){
    //const idBuscar: number = 1;
    this.categoriasService.obtenerCategoriaPorId(idBuscar).subscribe(response => {
      console.log(response);
    });
  }

  aplicarFiltro() {
    if (this.formulario.valid) {
      // Obtener los valores del formulario
      const filtros = this.formulario.value;
      
      // Filtrar la lista de documentos según los criterios
      let documentosFiltrados = this.listaDocumentos?.filter(doc => {
        let cumpleFiltros = true;

        // Filtrar por asunto (si no está vacío)
        if (filtros.asunto) {
          cumpleFiltros = cumpleFiltros && doc.asunto.toLowerCase().includes(filtros.asunto.toLowerCase());
        }

        // Filtrar por código
        if (filtros.codigo) {
          cumpleFiltros = cumpleFiltros && doc.codigo.toLowerCase().includes(filtros.codigo.toLowerCase());
        }

        // Filtrar por versión
        if (filtros.version) {
          //cumpleFiltros = cumpleFiltros && doc.versionID.toString() === filtros.version;
          cumpleFiltros = cumpleFiltros && doc.versionID.toString().includes(filtros.version);
        }

        // Filtrar por norma (si no es 0 - "Todos")
        if (filtros.normaID && filtros.normaID !== 0) {
          cumpleFiltros = cumpleFiltros && doc.normaID === filtros.normaID;
        }

        // Filtrar por tipo de documento
        if (filtros.tipoDocumento && filtros.tipoDocumento !== 0) {
          cumpleFiltros = cumpleFiltros && doc.tipoDocumento === filtros.tipoDocumento;
        }

        // Filtrar por categoría
        if (filtros.categoriaID && filtros.categoriaID !== 0) {
          cumpleFiltros = cumpleFiltros && doc.categoriaID === filtros.categoriaID;
        }

        // Filtrar por oficina
        if (filtros.oficinaID && filtros.oficinaID !== 0) {
          cumpleFiltros = cumpleFiltros && doc.oficinaID === filtros.oficinaID;
        }

        // Filtrar por docto
        if (filtros.doctoID && filtros.doctoID !== 0) {
          cumpleFiltros = cumpleFiltros && doc.doctoId === filtros.doctoID;
        }

        // Filtrar por clasificación
        if (filtros.clasificacionID && filtros.clasificacionID !== 0) {
          cumpleFiltros = cumpleFiltros && doc.clasificacionID === filtros.clasificacionID;
        }

        // Filtrar por palabra clave
        if (filtros.palabraClave) {
          cumpleFiltros = cumpleFiltros && doc.palabraClave.toLowerCase().includes(filtros.palabraClave.toLowerCase());
        }

        return cumpleFiltros;
      });

      // Si no hay documentos filtrados, mostrar mensaje
      if (!documentosFiltrados || documentosFiltrados.length === 0) {
        Swal.fire('Sin resultados', 'No se encontraron documentos que coincidan con los criterios de búsqueda.', 'info');
       
        return;
      }

      // Actualizar la tabla con los resultados filtrados
      this.setTable(documentosFiltrados);
     
    }
  }





  descargarDocumento(urlArchivo: any) {
 
    this.filtroVerticalService.manejarDescargaArchivo(urlArchivo);
  }


  observarDocumento(element: FiltroVerticalGetExtendidaDTO) {
    if (element.archivo.contentType === 'application/pdf') {
      const dialogRef = this.dialog.open(PdfViewerComponent, {
        data: { url: element.urlArchivo },
        panelClass: ['pdf-viewer-dialog', 'fullscreen-dialog'],
        maxWidth: '100vw',
        maxHeight: '100vh',
        height: '100vh',
        width: '100vw',
      });
    }
  }


  doctosData: DoctocDTO[] = [];

  mostrarRelaciones(id: number) {
    this.documentosService.obtenerDocumentoPorId(id).subscribe(response => {
      this.doctosData = response.doctos || [];
      console.log(this.doctosData);
      this.openModal();
    });
  }

  openModal() {
    this.dialog.open(DoctosModalComponent, {
      data: this.doctosData,
      width: '800px'
    });
  }

 
 



/********************************** Cargar listas para los catalogos *********************************************************************************************/

  obtenerTipoDocumentos(){
    this.tipodocumentoService.obtenerTipoducumentos().subscribe(response => {
      this.listaTipoDocumentos = response;
  })};

  obtenerCategorias(){
    this.categoriasService.obtenerCategorias().subscribe(response => {
      this.listaCategorias = response;
  })};

  obtenerOficinas(){
    this.oficinasService.obtenerOficinas().subscribe(response => {
      this.listaOficinas = response;
      console.log( this.listaOficinas);
  })};

  obtenerNormas(){
    this.normasService.obtenerNormas().subscribe(response => {
      this.listaNormas = response;
  })};

  obtenerClasificaciones(){
    this.clasificacionesService.obtenerClasificaciones().subscribe(response => {
      this.listaClasificaciones = response;
  })};

  obtenerDoctos(){
    this.doctocsService.obtenerDoctocs().subscribe(response => {
      this.listaDoctos = response;
  })};

  

  // Otros ***************************************************************************************************

  
  

  //no esta siendo utilizado
  obtenerCategoriasCargarTabla(){
    this.filtroVerticalService.obtenerFiltroVertical().subscribe(response => {
      this.listaDocumentos = response;
      this.setTable(this.listaDocumentos);
      console.log(this.listaDocumentos);
    });
  }

  setTable(data:FiltroVerticalGetDTO[]){

    setTimeout(() => {

      const dataConRelaciones: FiltroVerticalGetExtendidaDTO[] = data.map(documento => {
        const categoria = this.listaCategorias.find(cat => cat.id === documento.categoriaID);
        const tipoDocumento = this.listaTipoDocumentos.find(tipo => tipo.id === documento.tipoDocumento);
        const norma = this.listaNormas.find(nrm => nrm.id === documento.normaID);
        const oficina = this.listaOficinas.find(ofi => ofi.id === documento.oficinaID);
        const clasificacion = this.listaClasificaciones.find(clas => clas.id === documento.clasificacionID);
        const docto = this.listaDoctos.find(doctoc => doctoc.id === documento.doctoId);
  
        return {
          ...documento,
          categoriaNombre: categoria ? categoria.nombre : 'Sin Categoría',
          tipoDocumentoNombre: tipoDocumento ? tipoDocumento.nombre : 'Sin Tipo',
          normaNombre: norma ? norma.nombre : 'Sin Norma',
          oficinaNombre: oficina ? oficina.nombre : 'Sin oficina',
          clasificacionNombre: clasificacion ? clasificacion.nombre : 'Sin Clasificación',
          doctoNombre: docto ? docto.nombre : 'Sin Docto' // Suponiendo que `nombre` está en DocumentoGetDTO
        };
      });

      this.listCategoriasdataSource = new MatTableDataSource<FiltroVerticalGetExtendidaDTO>(dataConRelaciones);
      this.listCategoriasdataSource.paginator = this.paginator;
      
    }, 2000); 

  }
  
  realizarBusqueda() {
    this.filtrarData();
  }

  filtrarData(){

    /*
    const data = this.listaCategorias.slice();
    if(!this.textoBuscar){
     this.setTable(data);
      return;
    }

    const dataFiltrada = data.filter(item => {
      return item.nombre.includes(this.textoBuscar);
    })

    this.setTable(dataFiltrada);
    */
  }

  limpiarFormulario() {
    this.formulario.reset(); // Resetea los campos del formulario
    this.formulario.markAsPristine();  // Marcar como 'pristino'
    this.formulario.markAsUntouched(); // Marcar como 'intacto'
    this.formulario.updateValueAndValidity(); // Recalcular estado de validez
    this.limpiarErroresFormulario(); // Eliminar los errores
  }


 
  onSearchChange(event: any) {
    /*
    const filterValue = event.target.value?.trim().toLowerCase() || '';
    if (!filterValue) {
      // Si esta vacio, mostrar toda la lista
      this.setTable(this.listaCategorias);
      return;
    }
      */
    //pude haber hecho todo el filtro aqui, pero se requeria la necesidad del boton buscar
  }


  // validaciones *************************************************************************************

  obtenerErrorDescripcion() {
    /*
    const descripcion = this.formulario.controls.descripcion;
    if (descripcion.hasError('required')) {
      return 'El campo descripción es obligatorio';
    }
    return '';
    */
  }

  obtenerErrorNombre(){
    /*
    const nombre = this.formulario.controls.nombre;
   
    if (nombre.hasError('required')) {
      return 'El campo nombre es obligatorio';
    }

    
    if (nombre.hasError('pattern')) {
      return 'El campo nombre solo puede contener letras';
    }
    */
    return ''; 
  }

  limpiarErroresFormulario() {
    Object.keys(this.formulario.controls).forEach(key => {
      this.formulario.get(key)?.setErrors(null); // Eliminar los errores de cada control
    });
  }


}
