
import { RouterLink } from '@angular/router';


import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CategoriaDTO } from '../../Core/models/CategoriaDTO';
import { ClasificacionDTO } from '../../Core/models/ClasificacionDTO';
import { CategoriasService } from '../../Core/services/categorias.service';
import { ClasificacionesService } from '../../Core/services/clasificaciones.service';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatRadioModule} from '@angular/material/radio';

import Swal from 'sweetalert2';
import { MatSelectModule } from '@angular/material/select';



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

  categoriasService = inject(CategoriasService);
  clasificacionesService = inject(ClasificacionesService);
  listaCategorias! : CategoriaDTO[];
  clasificaciones!: ClasificacionDTO[];

  //tabla Relaciones
  listaRelacionesdataSource = new MatTableDataSource<CategoriaDTO>([]);
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
    this.obtenerClasificaciones();
    this.formulario.updateValueAndValidity();
  }
  
  constructor(){}

  private formbuilder = inject(FormBuilder);
  formulario = this.formbuilder.group({
    docsgId: ['', [Validators.required]],
    categoriaId: ['', [Validators.required]],
    normaId: ['', [Validators.required]],
    etapaId: ['', [Validators.required]],
    asunto: ['', [Validators.required]],
    codigo: ['', [Validators.required]],
    oficinaId: ['', [Validators.required]],
    descargable: [false],
    activo: [false],
    descripcion: ['', [Validators.required]],
    doctoId: ['', [Validators.required]],
    clasificacionId: ['', [Validators.required]],
    subclasificacionId: ['', [Validators.required]],
    vigencia: ['', [Validators.required]],
    palabrasClave: ['', [Validators.required]]
  });


 

  obtenerClasificaciones(){
    this.clasificacionesService.obtenerClasificaciones().subscribe(response => {
      this.clasificaciones = response;
    })};

  //CRUD **********************************************************
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

  crearCategoria(){
    
    if(this.formulario.invalid){
      alert("Formulario invalido");
    }else{

      const categoria = this.formulario.value as CategoriaDTO; 
      console.log(categoria);
  
      this.categoriasService.crearCategoria(categoria).subscribe(response => {
        console.log(response);
        this.obtenerCategoriasCargarTabla();
        this.formulario.reset();
        this.limpiarErroresFormulario();
        Swal.fire('Creada!', 'La categoría ha sido creada.', 'success');
      });

    }

  
  
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

  /*
  eliminarCategoria(idEliminar:number){

    this.categoriasService.eliminarCategoria(idEliminar).subscribe( response => {
      console.log(response);
      this.obtenerCategoriasCargarTabla();
    });
    
  }
    */

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


  

  // Otros **********************************************************

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


  // validaciones **********************************************************
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
    const clasificacionId = this.formulario.controls.clasificacionId;
  
    if (clasificacionId.hasError('required')) {
      return 'El campo clasificación es obligatorio';
    }
  
    return '';
  }



}
