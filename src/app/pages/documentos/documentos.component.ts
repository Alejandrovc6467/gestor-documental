
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
import { MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
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



@Component({
  selector: 'app-documentos',
  standalone: true,
  imports: [RouterLink, MatButtonModule,  MatFormFieldModule, MatSelectModule, ReactiveFormsModule, MatInputModule, MatTableModule, MatPaginatorModule, MatIconModule, FormsModule, MatCheckboxModule, MatRadioModule ],
  templateUrl: './documentos.component.html',
  styleUrl: './documentos.component.css'
})
export class DocumentosComponent implements OnInit {

  //id!:  number;
  id = 7;

  tipodocumentoService = inject(TipodocumentoService);
  categoriasService = inject(CategoriasService);
  normasService = inject(NormasService);
  etapasService = inject(EtapasService);
  //falta Oficinas service, despues del modulo de seguridad
  doctocsService = inject(DoctocsService);
  clasificacionesService = inject(ClasificacionesService);
  subclasificacionesService = inject(SubclasificacionesService);
  documentosService = inject(DocumentosService);
  

  listaTipoDocumentos! : TipodocumentoDTO[];
  listaCategorias! : CategoriaDTO[];
  listaNormas! : CategoriaDTO[];
  listaEtapas! : EtapaDTO[];
  listaDoctos! : DoctocDTO[];
  listaClasificaciones!: ClasificacionDTO[];
  listaSubClasificaciones!: SubclasificacionDTO[];

  //lista para relacionar Documentos
  doctos: { docto: number, docRelacionado: string }[] = [];


  //tabla Relaciones
  listaRelacionesdataSource = new MatTableDataSource<RelacionDocumentoDTO>([]);
  displayedColumnsRelaciones: string[] = [ 'acciones', 'docto', 'docrelacionado'];
  @ViewChild(MatPaginator) paginatorRelaciones!: MatPaginator;

  //tablaDocumentos
  listCategoriasdataSource = new MatTableDataSource<CategoriaDTO>([]);
  displayedColumns: string[] = [ 'acciones', 'categoria', 'tipo', 'norma', 'codigo', 'documento' , 'version', 'oficina', 'docto' , 'clasificacion', 'vigencia' ];
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  textoBuscar: string = "";
  textoBuscarRelaciones: string = "";
  estaEditando: boolean = false;
  categoriaSeleccionada!: CategoriaDTO | null;


  ngOnInit(): void {

    this.obtenerCategoriasCargarTabla();

    this.obtenerTipoDocumentos();
    this.obtenerCategorias();
    this.obtenerNormas();
    this.obtenerDoctos();
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
    doctoID: [0, [Validators.required]],
    clasificacionID: ['', [Validators.required]],
    subClasificacionID: [0, [Validators.required]],
    vigencia: ['', [Validators.required]],
    palabraClave: ['', [Validators.required]]
  });


  relacionDocumentoFormulario = this.formbuilder.group({
    doctoId: [0, Validators.required],
    docRelacionado: ['', Validators.required]
  });

 

  //CRUD **********************************************************
  obtenerDocumentos(){
    this.categoriasService.obtenerCategorias().subscribe(response => {
      this.listaCategorias = response;
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
      return;
    }

    const documentoData = this.formulario.value as DocumentoDTO;
    
    const documento: DocumentoDTO = {
      ...documentoData,
      id: 0, // Asumiendo que el ID se asigna en el backend
      codigo: documentoData.codigo?.toString() || '',
      asunto: documentoData.asunto?.toString() || '',
      descripcion: documentoData.descripcion?.toString() || '',
      palabraClave: documentoData.palabraClave || '',
      categoriaID: documentoData.categoriaID || 0,
      tipoDocumento: documentoData.tipoDocumento || 0,
      oficinaID: documentoData.oficinaID || 0,
      vigencia: documentoData.vigencia?.toString() || '',
      etapaID: documentoData.etapaID || 0,
      subClasificacionID: documentoData.subClasificacionID || 0,
      doctos: this.doctos,
   
      // Asegúrate de que estos campos estén presentes y con el tipo correcto
      activo: documentoData.activo || false,
      descargable: documentoData.descargable || false,
      doctoID: documentoData.doctoID || 0
    };

    console.log(documento);

    
    this.documentosService.crearDocumento(documento).subscribe({
      next: (response) => {
        console.log(response);
        this.formulario.reset();
        this.doctos = []; // Limpiar la lista de doctos relacionados
        this.limpiarErroresFormulario();
        Swal.fire('Creado', 'El documento ha sido creado exitosamente', 'success');
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
        this.obtenerCategoriasCargarTabla();
        this.cancelarEdicion();
        this.limpiarErroresFormulario();
        Swal.fire('Editada!', 'La categoría ha sido editada.', 'success');
      });
      */
  }

  editarCategoria(element: CategoriaDTO) {
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

  eliminarCategoria(idEliminar: number) {
    // Mostrar el SweetAlert para confirmar la eliminación
    Swal.fire({
        title: '¿Desea eliminar la categoría?',
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
            this.categoriasService.eliminarCategoria(idEliminar).subscribe(response => {
                console.log(response);
                this.obtenerCategoriasCargarTabla();
                Swal.fire('Eliminado!', 'La categoría ha sido eliminada.', 'success');
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

  onNormaChange(normaId: number) {
    this.obtenerEtapas(normaId);
  }

  obtenerEtapas(normaId: number) {
    this.etapasService.obtenerEtapas().subscribe(response => {
      this.listaEtapas = response.filter(etapa => etapa.normaID === normaId);
    });
  }

  obtenerDoctos(){
    this.doctocsService.obtenerDoctocs().subscribe(response => {
      this.listaDoctos = response;
  })};
  
  obtenerClasificaciones(){
    this.clasificacionesService.obtenerClasificaciones().subscribe(response => {
      this.listaClasificaciones = response;
  })};

  onClasificacionChange(clasificacionId: number) {
    this.obtenerSubClasificaciones(clasificacionId);
  }

  // Método para obtener las subclasificaciones filtradas por clasificación (Al momento de elegir una clasificacion)
  obtenerSubClasificaciones(clasificacionId: number) {
    this.subclasificacionesService.obtenerSubclasificaciones().subscribe(response => {
      this.listaSubClasificaciones = response.filter(subclasificacion => subclasificacion.clasificacionID === clasificacionId);
    });
  }

  




  /******************   Agregar relaciones documentos ****************************************************************************************************/
 
  agregarRelacionDocumento() {
    if (this.relacionDocumentoFormulario.valid) {
      const docto = this.relacionDocumentoFormulario.get('doctoId')?.value;
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
 
 




  // Otros ***********************************************************************************

  obtenerCategoriasCargarTabla(){
    this.categoriasService.obtenerCategorias().subscribe(response => {
      this.listaCategorias = response;
      this.setTable(this.listaCategorias);
    });
  }

  setTable(data:CategoriaDTO[]){
    this.listCategoriasdataSource = new MatTableDataSource<CategoriaDTO>(data);
    this.listCategoriasdataSource.paginator = this.paginator;
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
