
import { RouterLink } from '@angular/router';


import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CategoriaDTO } from '../../Core/models/CategoriaDTO';
import { ClasificacionDTO } from '../../Core/models/ClasificacionDTO';

import { TipodocumentoService } from '../../Core/services/tipodocumento.service';
import { CategoriasService } from '../../Core/services/categorias.service';
import {  NormasService  } from '../../Core/services/normas.service';
import {  EtapasService  } from '../../Core/services/etapas.service';
import {  DoctocsService  } from '../../Core/services/doctocs.service';
import { ClasificacionesService } from '../../Core/services/clasificaciones.service';
import { SubclasificacionesService } from '../../Core/services/subclasificaciones.service';
import { DocumentosService } from '../../Core/services/documentos.service';


import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl, MatPaginatorModule} from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatRadioModule} from '@angular/material/radio';

import Swal from 'sweetalert2';
import { MatSelectModule } from '@angular/material/select';
import { TipodocumentoDTO } from '../../Core/models/TipodocumentoDTO';
import { EtapaDTO } from '../../Core/models/EtapaDTO';
import { DoctocDTO } from '../../Core/models/DoctocDTO';
import { SubclasificacionDTO } from '../../Core/models/SubclasificacionDTO';
import { RelacionDocumentoDTO } from '../../Core/models/RelacionDocumentoDTO';
import { DocumentoDTO } from '../../Core/models/DocumentoDTO';
import { DocumentoGetDTO, DocumentoGetExtendidaDTO } from '../../Core/models/DocumentoGetDTO';
import { CustomMatPaginatorIntlComponent } from '../../Core/components/custom-mat-paginator-intl/custom-mat-paginator-intl.component';
import { OficinasService } from '../../Core/services/oficinas.service';
import { OficinaDTO } from '../../Core/models/OficinaDTO';



@Component({
  selector: 'app-documentos',
  standalone: true,
  imports: [RouterLink, MatButtonModule,  MatFormFieldModule, MatSelectModule, ReactiveFormsModule, MatInputModule, MatTableModule, MatPaginatorModule, MatIconModule, FormsModule, MatCheckboxModule, MatRadioModule ],
  templateUrl: './documentos.component.html',
  styleUrl: './documentos.component.css',
  providers: [
    { provide: MatPaginatorIntl, useClass: CustomMatPaginatorIntlComponent }
  ]
})
export class DocumentosComponent implements OnInit {

 

  tipodocumentoService = inject(TipodocumentoService);
  categoriasService = inject(CategoriasService);
  normasService = inject(NormasService);
  etapasService = inject(EtapasService);
  oficinasService = inject(OficinasService);
  doctocsService = inject(DoctocsService);
  clasificacionesService = inject(ClasificacionesService);
  subclasificacionesService = inject(SubclasificacionesService);
  documentosService = inject(DocumentosService);
  

  listaTipoDocumentos! : TipodocumentoDTO[];
  listaCategorias! : CategoriaDTO[];
  listaNormas! : CategoriaDTO[];
  listaOficinas! : OficinaDTO[];
  listaEtapasPorId! : EtapaDTO[];
  listaEtapas! : EtapaDTO[];
  listaDoctos! : DoctocDTO[];
  listaClasificaciones!: ClasificacionDTO[];
  listaSubClasificacionesPorId!: SubclasificacionDTO[];
  listaSubClasificaciones!: SubclasificacionDTO[];
  listaDocumentos!: DocumentoGetDTO[];

  //lista para relacionar Documentos
  doctos: { docto: number, docRelacionado: string }[] = [];


  //tabla Relaciones
  listaRelacionesdataSource = new MatTableDataSource<RelacionDocumentoDTO>([]);
  displayedColumnsRelaciones: string[] = [ 'acciones', 'docto', 'docrelacionado'];
  @ViewChild(MatPaginator) paginatorRelaciones!: MatPaginator;

  //tablaDocumentos
  listaDocumentosDataSource = new MatTableDataSource<DocumentoGetExtendidaDTO>([]);
  displayedColumns: string[] = [ 'acciones', 'categoria', 'tipo', 'etapa', 'norma','codigo', 'nombre' , 'version', 'oficina',  'docto' , 'clasificacion', 'subclasificacion',  'vigencia' ];
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  textoBuscar: string = "";
  textoBuscarRelaciones: string = "";
  estaEditando: boolean = false;
  categoriaSeleccionada!: CategoriaDTO | null;


  ngOnInit(): void {

    this.obtenerDocumentosCargarTabla();

    this.obtenerTipoDocumentos();
    this.obtenerCategorias();
    this.obtenerNormas();
    this.obtenerOficinas();
    this.obtenerDoctos();
    this.obtenerEtapas();
    this.obtenerSubClasificaciones();
    this.obtenerClasificaciones();

    this.formulario.updateValueAndValidity();
  }
  
  constructor(){}

  private formbuilder = inject(FormBuilder);
  formulario = this.formbuilder.group({
    tipoDocumento: [0, [Validators.required]],
    categoriaID: [0, [Validators.required]],
    normaID: ['', [Validators.required]],
    etapaID: [0, [Validators.required]],
    asunto: ['', [Validators.required]],
    codigo: ['', [Validators.required]],
    oficinaID: [0, [Validators.required]],
    descargable: [false],
    activo: [false],
    descripcion: ['', [Validators.required]],
    doctoID: [0],
    clasificacionID: [''],
    subClasificacionID: [0],
    vigencia: [''],
    palabraClave: ['']
  });


  relacionDocumentoFormulario = this.formbuilder.group({
    docto: [0, Validators.required],
    docRelacionado: ['', Validators.required]
  });

 

  //CRUD ********************************************************************************************************************
  obtenerDocumentos(){
    this.documentosService.obtenerDocumentos().subscribe(response => {
      this.listaDocumentos = response;
    });
  }

  obtenerCategoriaPorId(idBuscar:number){
    //const idBuscar: number = 1;
    this.categoriasService.obtenerCategoriaPorId(idBuscar).subscribe(response => {
      console.log(response);
    });
  }
  
  crearDocumento() {
    if (this.formulario.invalid) {
      Swal.fire('Error', 'Por favor, complete todos los campos requeridos', 'error');
      console.log("error al registar documento");
      return;
    }

    //const documentoData = this.formulario.value as DocumentoDTO;

    const palabrasClave: string[] = ["Nesesario", "importante", "oficina", "proyecto", "revisión"];

    
    const documento: DocumentoDTO = {
    
      id: 0, // Asumiendo que el ID se asigna en el backend
      codigo: this.formulario.value.codigo?.toString()|| '',
      asunto:this.formulario.value.asunto?.toString()|| '',
      descripcion: this.formulario.value.descripcion?.toString() || '',
      palabraClave: palabrasClave || '',
      categoriaID: this.formulario.value.categoriaID || 0,
      tipoDocumento: this.formulario.value.tipoDocumento || 0,
      oficinaID: this.formulario.value.oficinaID || 0,
      vigencia: this.formulario.value.vigencia?.toString() || '',
      etapaID: this.formulario.value.etapaID || 0,
      subClasificacionID: this.formulario.value.subClasificacionID || 0,
      doctos: this.doctos,
   
      // Asegúrate de que estos campos estén presentes y con el tipo correcto
      activo: this.formulario.value.activo || false,
      descargable: this.formulario.value.descargable || false,
      doctoId: this.formulario.value.doctoID || 0,
      usuarioID: 1,
      oficinaUsuarioID: 1,
      clasificacionID:1,
      normaID:1,
      versionID:1
    };

    //usuarioID y oficinaUsuarioID los tomo del localStorage


    console.log(documento);

    
    this.documentosService.crearDocumento(documento).subscribe({
      next: (response) => {
        console.log(response);

        if(response){
          this.formulario.reset();
          this.doctos = []; // Limpiar la lista de doctos relacionados
          this.limpiarErroresFormulario();
          this.obtenerDocumentosCargarTabla();
          Swal.fire('Creado', 'El documento ha sido creado exitosamente', 'success');
        }else{
          Swal.fire('Error', 'El documento no ha sido creado exitosamente', 'error');
        }
      
      },
      error: (error) => {
        console.error('Error al crear el documento:', error);
        Swal.fire('Error', 'Hubo un problema al crear el documento', 'error');
      }
    });
    
  }

  actualizarCategoria() {
    /*
    if (!this.categoriaSeleccionada) return;
      const categoriaActualizada: CategoriaDTO = {
        id: this.categoriaSeleccionada.id,
        nombre: this.formulario.value.nombre!,
        descripcion: this.formulario.value.descripcion!
      };
      this.categoriasService.actualizarCategoria(categoriaActualizada).subscribe(response => {
        console.log(response);
        this.obtenerDocumentosCargarTabla();
        this.cancelarEdicion();
        this.limpiarErroresFormulario();
        Swal.fire('Editada!', 'La categoría ha sido editada.', 'success');
      });
      */
  }

  editarDocumento(element: DocumentoGetDTO) {

    console.log(element);

    //fijarme en el editar y actualizar de etapas

    //cargar todos los campos del formualrio con los datos
    //y ademas cargar "doctos" con documento.doctos y doctos a listaRelacionesDataSource
    //cunado se agregue una relacion nueva se agrega a doctos



    /*
    // Método para cargar los datos de la categoría seleccionada y activar el modo de edición
    this.estaEditando = true;
    this.categoriaSeleccionada = element;
    // Cargar los datos de la categoría en el formulario
    this.formulario.patchValue({
      nombre: element.nombre,
      descripcion: element.descripcion
    });
    this.limpiarErroresFormulario();
    */
  }

  cancelarEdicion() {
    this.estaEditando = false;
    this.categoriaSeleccionada = null;
    this.formulario.reset(); // Limpiar el formulario
    this.formulario.markAsPristine();  // Marcar como 'pristino'
    this.formulario.markAsUntouched(); // Marcar como 'intacto'
    this.formulario.updateValueAndValidity(); // Recalcular estado de validez
  }

  eliminarDocumento(idEliminar: number) {
    // Mostrar el SweetAlert para confirmar la eliminación
    Swal.fire({
        title: '¿Desea eliminar el documento?',
        text: 'Esta acción no se puede deshacer.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Eliminar'
     
    }).then((result) => {
        if (result.isConfirmed) {
            // Si el usuario confirma, proceder con la eliminación
            this.documentosService.eliminarDocumento(idEliminar).subscribe(response => {
                console.log(response);
                this.obtenerDocumentosCargarTabla();
                Swal.fire('Eliminado!', 'El documento ha sido eliminado.', 'success');
            });
        }
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
      console.log( this.listaOficinas);
  })};

  onNormaChange(normaId: number) {
    this.obtenerEtapasPorId(normaId);
  };

  // Método para obtener las etapas filtradas por normmas (Al momento de elegir una norma)
  obtenerEtapasPorId(normaId: number) {
    this.etapasService.obtenerEtapas().subscribe(response => {
      this.listaEtapasPorId = response.filter(etapa => etapa.normaID === normaId);
    });
  };

  obtenerEtapas(){
    this.etapasService.obtenerEtapas().subscribe(response => {
      this.listaEtapas = response;
  })};
  
  obtenerDoctos(){
    this.doctocsService.obtenerDoctocs().subscribe(response => {
      this.listaDoctos = response;
  })};
  
  obtenerClasificaciones(){
    this.clasificacionesService.obtenerClasificaciones().subscribe(response => {
      this.listaClasificaciones = response;
  })};

  onClasificacionChange(clasificacionId: number) {
    this.obtenerSubClasificacionesPorId(clasificacionId);
  };

  // Método para obtener las subclasificaciones filtradas por clasificación (Al momento de elegir una clasificacion)
  obtenerSubClasificacionesPorId(clasificacionId: number) {
    this.subclasificacionesService.obtenerSubclasificaciones().subscribe(response => {
      this.listaSubClasificacionesPorId = response.filter(subclasificacion => subclasificacion.clasificacionID === clasificacionId);
    });
  };

  obtenerSubClasificaciones(){
    this.subclasificacionesService.obtenerSubclasificaciones().subscribe(response => {
      this.listaSubClasificaciones = response;
  })};
  
  




  /******************   Agregar relaciones documentos ****************************************************************************************************/
 
  agregarRelacionDocumento() {
    if (this.relacionDocumentoFormulario.valid) {
      const docto = this.relacionDocumentoFormulario.get('docto')?.value;
      const docRelacionado = this.relacionDocumentoFormulario.get('docRelacionado')?.value;

      this.doctos.push({
        docto: docto!,
        docRelacionado: docRelacionado!
      });


      Swal.fire('Creada!', 'La relacion ha sido creada.', 'success');

      // Optionally, update your data source for the relations table
      this.actualizarTablaRelaciones();

      // Reset the form after adding
      this.relacionDocumentoFormulario.reset();

      console.log(this.doctos);
    }
  }

  actualizarTablaRelaciones() {
    this.listaRelacionesdataSource.data = this.doctos;
  }

  eliminarRelacionDocumento(id: number) {
    // Buscar el índice del documento a eliminar usando el id
    const index = this.doctos.findIndex(docto => docto.docto === id);
    
    if (index !== -1) {
      // Eliminar el documento de la lista
      this.doctos.splice(index, 1);
  
      // Actualizar la tabla con la lista modificada
      this.actualizarTablaRelaciones();
  
      Swal.fire('Eliminada!', 'La relación ha sido eliminada.', 'success');
  
      console.log(this.doctos);
    } else {
      Swal.fire('Error', 'No se encontró la relación a eliminar.', 'error');
    }
  }
  
 




  // Otros ***********************************************************************************

  obtenerDocumentosCargarTabla(){
    this.documentosService.obtenerDocumentos().subscribe(response => {
      this.listaDocumentos = response;
      this.setTable(this.listaDocumentos);
    });
  }

  setTable(data: DocumentoGetDTO[]) {

      // Simulamos una espera con setTimeout para alguna carga visual si es necesario
      setTimeout(() => {
    
        // Mapear los datos para agregar nombres de relaciones (categoría, tipo de documento, etc.)
        const dataConRelaciones: DocumentoGetExtendidaDTO[] = data.map(documento => {
          const categoria = this.listaCategorias.find(cat => cat.id === documento.categoriaID);
          const tipoDocumento = this.listaTipoDocumentos.find(tipo => tipo.id === documento.tipoDocumento);
          const etapa = this.listaEtapas.find(etp => etp.id === documento.etapaID);
          const norma = this.listaNormas.find(nrm => nrm.id === documento.normaID);
          const oficina = this.listaOficinas.find(ofi => ofi.id === documento.oficinaID);
          const clasificacion = this.listaClasificaciones.find(clas => clas.id === documento.clasificacionID);
          const subClasificacion = this.listaSubClasificaciones.find(sub => sub.id === documento.subClasificacionID);
          const docto = this.listaDoctos.find(doctoc => doctoc.id === documento.doctoId);
    
          return {
            ...documento,
            categoriaNombre: categoria ? categoria.nombre : 'Sin Categoría',
            tipoDocumentoNombre: tipoDocumento ? tipoDocumento.nombre : 'Sin Tipo',
            etapaNombre: etapa ? etapa.nombre : 'Sin Etapa',
            normaNombre: norma ? norma.nombre : 'Sin Norma',
            oficinaNombre: oficina ? oficina.nombre : 'Sin oficina',
            clasificacionNombre: clasificacion ? clasificacion.nombre : 'Sin Clasificación',
            subClasificacionNombre: subClasificacion ? subClasificacion.nombre : 'Sin Subclasificación',
            doctoNombre: docto ? docto.nombre : 'Sin Docto' // Suponiendo que `nombre` está en DocumentoGetDTO
          };
        });
    
        // Configuramos el DataSource con los datos mapeados
        this.listaDocumentosDataSource = new MatTableDataSource<DocumentoGetExtendidaDTO>(dataConRelaciones);
        this.listaDocumentosDataSource.paginator = this.paginator;
    
      }, 2000); // Ajusta este delay si no es necesario
  }
  
  realizarBusqueda() {
    this.filtrarData();
  }

  filtrarData(){

    const data = this.listaCategorias.slice();
    if(!this.textoBuscar){
     this.setTable(data);
      return;
    }

    const dataFiltrada = data.filter(item => {
      return item.nombre.includes(this.textoBuscar);
    })

    this.setTable(dataFiltrada);
  }

  limpiarFormulario() {
    this.formulario.reset(); // Resetea los campos del formulario
    this.formulario.markAsPristine();  // Marcar como 'pristino'
    this.formulario.markAsUntouched(); // Marcar como 'intacto'
    this.formulario.updateValueAndValidity(); // Recalcular estado de validez
    this.limpiarErroresFormulario(); // Eliminar los errores
  }

  onSearchChange(event: any) {
    const filterValue = event.target.value?.trim().toLowerCase() || '';
    if (!filterValue) {
      // Si esta vacio, mostrar toda la lista
      this.setTable(this.listaCategorias);
      return;
    }
    //pude haber hecho todo el filtro aqui, pero se requeria la necesidad del boton buscar
  }






  // validaciones ********************************************************************************************************************

  obtenerErrorDescripcion() {
    const descripcion = this.formulario.controls.descripcion;
    if (descripcion.hasError('required')) {
      return 'El campo descripción es obligatorio';
    }
    return '';
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
    
    return ''; 
    */
  }

  limpiarErroresFormulario() {
    Object.keys(this.formulario.controls).forEach(key => {
      this.formulario.get(key)?.setErrors(null); // Eliminar los errores de cada control
    });
  }

  obtenerErrorClasificacionId() {
    const clasificacionId = this.formulario.controls.clasificacionID;
  
    if (clasificacionId.hasError('required')) {
      return 'El campo clasificación es obligatorio';
    }
  
    return '';
  }

  obtenerErrorSubclasificacionId() {
    
  }

  obtenerErrorDoctoId(){

  }

  obtenerErrorDocRelacionado(){

  }
 


}
