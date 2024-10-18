import {  Input, numberAttribute } from '@angular/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CategoriaDTO } from '../../Core/models/CategoriaDTO';
import { CategoriasService } from '../../Core/services/categorias.service';
import { DocumentosService } from '../../Core/services/documentos.service';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { DocumentoGetDTO } from '../../Core/models/DocumentoGetDTO';



@Component({
  selector: 'app-documentoversiones',
  standalone: true,
  imports: [MatButtonModule,  MatFormFieldModule, ReactiveFormsModule, MatInputModule, MatTableModule, MatPaginatorModule, MatIconModule, FormsModule, MatDatepickerModule, MatNativeDateModule,  MatCheckboxModule, MatRadioModule],
  templateUrl: './documentoversiones.component.html',
  styleUrl: './documentoversiones.component.css'
})
export class DocumentoversionesComponent implements OnInit  {

  @Input({transform: numberAttribute})
  id!: number;




  categoriasService = inject(CategoriasService);
  documentosService = inject(DocumentosService);
  listaCategorias! : CategoriaDTO[];
  listCategoriasdataSource = new MatTableDataSource<CategoriaDTO>([]);
  displayedColumns: string[] = [ 'acciones', 'nombre', 'descripcion' ];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  textoBuscar: string = "";
  estaEditando: boolean = false;
  categoriaSeleccionada!: CategoriaDTO | null;

  objetoDocumentoParaCargarDatosQuemados!: DocumentoGetDTO | null;


  ngOnInit(): void {
    this.obtenerCategoriasCargarTabla();
    this.formulario.updateValueAndValidity();
  }
  
  constructor(){}

  private formbuilder = inject(FormBuilder);
  formulario = this.formbuilder.group({
    nombre: ['', [Validators.required]],
    descripcion: ['', [Validators.required]],
    FechaCreacion: new FormControl<Date | null> (null, {validators: [Validators.required]}),
    docDinamico: [false],
    obsoleto: [false],
    archivo: new FormControl<File | null>(null, [Validators.required])
  });

  //archivo: new FormControl<File | null>(null, [Validators.required])

  archivoSeleccionado(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.formulario.patchValue({
        archivo: file
      });
    }
  }


  //llamar este  en el onInit()
  cargarCamposQuemadosEnHtml(){

    this.documentosService.obtenerDocumentoPorId(this.id).subscribe(response => {
      console.log(response);
      this.objetoDocumentoParaCargarDatosQuemados = response;
    });

    //antes poner todos los campos en el formulario obvio creo que faltan

    //aqui setear los datos y ponerlos los campos no modificables,

   
    
  }



  //CRUD ************************************************************************************************
  obtenerCategorias(){
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

  crearVersion(){
    
    console.log(this.formulario.value);
    console.log("Entre al crear version");

    /*
    if(this.formulario.invalid){
      alert("Formulario invalido");
    }else{

      const version = this.formulario.value as CategoriaDTO; 
      console.log(version);
  

      this.categoriasService.crearCategoria(version).subscribe(response => {
        console.log(response);
        this.obtenerCategoriasCargarTabla();
        this.formulario.reset();
        this.limpiarErroresFormulario();
        Swal.fire('Creada!', 'La categoría ha sido creada.', 'success');
      });

    }
      */

  
  
  }

  actualizarCategoria() {
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
  }

  editarCategoria(element: CategoriaDTO) {
    // Método para cargar los datos de la categoría seleccionada y activar el modo de edición
    this.estaEditando = true;
    this.categoriaSeleccionada = element;
    // Cargar los datos de la categoría en el formulario
    this.formulario.patchValue({
      nombre: element.nombre,
      descripcion: element.descripcion
    });
    this.limpiarErroresFormulario();
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


  

  // Otros *******************************************************************************************

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


  /*
  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.formulario.patchValue({
        documento: file
      });
      this.formulario.get('documento')?.updateValueAndValidity();
    }
  }
  */


  
  // validaciones *******************************************************************************************************************
  obtenerErrorDescripcion() {
    const descripcion = this.formulario.controls.descripcion;
    if (descripcion.hasError('required')) {
      return 'El campo descripción es obligatorio';
    }
    return '';
  }

  obtenerErrorNombre(){
    const nombre = this.formulario.controls.nombre;
   
    if (nombre.hasError('required')) {
      return 'El campo nombre es obligatorio';
    }

    
    if (nombre.hasError('pattern')) {
      return 'El campo nombre solo puede contener letras';
    }
    
    return ''; 
  }

  limpiarErroresFormulario() {
    Object.keys(this.formulario.controls).forEach(key => {
      this.formulario.get(key)?.setErrors(null); // Eliminar los errores de cada control
    });
  }

  obtenerErrorFecha() {
    const fecha = this.formulario.controls.FechaCreacion;
    if (fecha.hasError('required')) {
      return 'La fecha es obligatoria';
    }
    return '';
  }

  obtenerErrorDocumento() {
    const documento = this.formulario.controls.archivo;
    if (documento.hasError('required')) {
      return 'El documento es obligatorio';
    }
    return '';
  }

  obtenerErrorArchivo() {
    const control = this.formulario.get('archivo');
    if (control?.hasError('required')) {
      return 'El archivo es requerido';
    }
    return '';
  }

}
