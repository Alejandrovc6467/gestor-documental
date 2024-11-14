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
import { MatDialog } from '@angular/material/dialog';
import { PdfViewerComponent } from '../../Core/components/pdf-viewer/pdf-viewer.component';
import { DocumentosService } from '../../Core/services/documentos.service';
import { DoctosModalComponent } from '../../Core/components/doctos-modal/doctos-modal.component';
import { OficinasService } from '../../Core/services/oficinas.service';
import { OficinaDTO } from '../../Core/models/OficinaDTO';
import { EtapasService } from '../../Core/services/etapas.service';

import { EtapaDTO } from '../../Core/models/EtapaDTO';
import { NormaTreeComponent } from '../../Core/components/norma-tree/norma-tree.component';
import { ComponentFixture } from '@angular/core/testing';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MovimientoDTO } from '../../Core/models/MovimientoDTO';
import { MovimientoService } from '../../Core/services/movimiento.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-filtro-horizontal-proceso',
  standalone: true,
  imports: [MatButtonModule, RouterLink,  MatFormFieldModule, MatSelectModule, ReactiveFormsModule, MatInputModule, MatTableModule, MatPaginatorModule, MatIconModule, FormsModule,NormaTreeComponent, MatTooltipModule ],
  templateUrl: './filtro-horizontal-proceso.component.html',
  styleUrl: './filtro-horizontal-proceso.component.css',
  providers: [
    { provide: MatPaginatorIntl, useClass: CustomMatPaginatorIntlComponent }
  ]
})
export class FiltroHorizontalProcesoComponent {

  private dialog = inject(MatDialog);

  etapas: EtapaDTO[] = [];
  etapaService = inject(EtapasService);
  filtroVerticalService = inject(FiltroVerticalService);
  normasService = inject(NormasService);
  tipodocumentoService = inject(TipodocumentoService);
  categoriasService = inject(CategoriasService);
  oficinasService = inject(OficinasService);
  doctocsService = inject(DoctocsService);
  clasificacionesService = inject(ClasificacionesService);
  documentosService = inject(DocumentosService);
  movimientoService = inject(MovimientoService);


  listaNormas! : CategoriaDTO[];
  listaTipoDocumentos! : TipodocumentoDTO[];
  listaDocumentos! : FiltroVerticalGetDTO[];
  listaCategorias! : CategoriaDTO[];
  listaOficinas! : OficinaDTO[];
  listaDoctos! : DoctocDTO[];
  listaClasificaciones!: ClasificacionDTO[];


  listCategoriasdataSource = new MatTableDataSource<FiltroVerticalGetExtendidaDTO>([]);
  displayedColumns: string[] = [ 'acciones',  'documento', 'version', 'oficina', 'carpetaRelaciones'  ];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  textoBuscar: string = "";
  estaEditando: boolean = false;
  categoriaSeleccionada!: CategoriaDTO | null;


  usuarioIDLogin: number = Number(localStorage.getItem('usuarioID'));
  oficinaIDLogin: number = Number(localStorage.getItem('oficinaSeleccionadaId'));

  ngOnInit(): void {

    //this.obtenerCategoriasCargarTabla();

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
    normaID: [0, [Validators.required]]
  });




  //CRUD *******************************************************************************
  
  obtenerDocumentos(){
    const usuarioID = this.usuarioIDLogin;
    this.filtroVerticalService.obtenerFiltroVertical(usuarioID).subscribe(response => {
      this.listaDocumentos = response;
      console.log(this.listaDocumentos);
    });
  }


  obtenerCategoriaPorId(idBuscar:number){
    this.categoriasService.obtenerCategoriaPorId(idBuscar).subscribe(response => {
      console.log(response);
    });
  }


  // Filtro principal *************************************************************************************

  // Agregar este método para manejar el cambio de norma
  onNormaSelected() {
    const normaId = this.formulario.get('normaID')?.value;
      if (normaId) {
        console.log('Norma seleccionada:', normaId);
        this.etapaService.obtenerEtapasPorNorma(normaId).subscribe(
          (etapas) => {
             this.etapas = etapas;
          },
            (error) => {
              console.error('Error al obtener las etapas:', error);
          }
        );
    }
  }

  aplicarFiltro() {

    console.log('Aplicar filtro presionado');

    if (this.formulario.valid) {
      console.log('invalido');
      return;
      
    }

      
  }




  // Descar y visualizacion de documentos ***********************************************************************************
  
  descargarDocumento(element: any) {

    if(element.descargable){

      Swal.fire({
        title: '¿Desea descargar el documento?',
        text: 'Esta acción no se puede deshacer.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Sí'
     
       }).then((result) => {
        if (result.isConfirmed) {

          this.filtroVerticalService.manejarDescargaArchivo(element.urlArchivo);

          //envio de datos a bitacora
          const movimiento:  MovimientoDTO = {
            idMovimiento: 0,
            versionID: element.versionID,
            fechaIngreso: new Date().toISOString(),
            usuarioID: this.usuarioIDLogin,
            movimiento: true
          };
          this.movimientoService.RegistrarMovimiento(movimiento).subscribe(response => {
            console.log(response);
          });


        }
      });


    }else{
      Swal.fire('Error!', 'El documento no es descargable.', 'error');
    }

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

      const movimiento:  MovimientoDTO = {
        idMovimiento: 0,
        versionID: element.versionID,
        fechaIngreso: new Date().toISOString(),
        usuarioID: this.usuarioIDLogin,
        movimiento: false
      };
  
      this.movimientoService.RegistrarMovimiento(movimiento).subscribe(response => {
        console.log(response);
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

  obtenerNormas(){
    this.normasService.obtenerNormas().subscribe(response => {
      this.listaNormas = response;
  })};

  obtenerOficinas(){
    this.oficinasService.obtenerOficinas().subscribe(response => {
      this.listaOficinas = response;
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


  //cuando este el filtro funcionando


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
  

  // Busqueda en input buscar de tabla *****************************************************************************

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


  // validaciones **********************************************************************************************************

  obtenerErrorNorma(){
    const norma = this.formulario.controls.normaID;
    if (norma.hasError('required')) {
      return 'El campo norma es obligatorio';
    }
    return '';
  }
  

  limpiarErroresFormulario() {
    Object.keys(this.formulario.controls).forEach(key => {
      this.formulario.get(key)?.setErrors(null); // Eliminar los errores de cada control
    });
  }

}
