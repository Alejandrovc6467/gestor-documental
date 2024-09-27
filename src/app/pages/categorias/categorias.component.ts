

import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CategoriaDTO } from '../../Core/models/CategoriaDTO';
import { CategoriasService } from '../../Core/services/categorias.service';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [MatButtonModule,  MatFormFieldModule, ReactiveFormsModule, MatInputModule, MatTableModule, MatPaginatorModule, MatIconModule, FormsModule],
  templateUrl: './categorias.component.html',
  styleUrl: './categorias.component.css'
})
export class CategoriasComponent implements OnInit {

  categoriasService = inject(CategoriasService);
  listaCategorias! : CategoriaDTO[];
  listCategoriasdataSource = new MatTableDataSource<CategoriaDTO>([]);
  displayedColumns: string[] = ['id', 'nombre', 'descripcion', 'acciones'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  textoBuscar: string = "";
  estaEditando: boolean = false;
  categoriaSeleccionada!: CategoriaDTO | null;


  ngOnInit(): void {
    this.obtenerCategoriasCargarTabla();
  }
  
  constructor(){}

  private formbuilder = inject(FormBuilder);
  formulario = this.formbuilder.group({
    nombre: ['', Validators.required],
    descripcion: ['', Validators.required]
  })


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
    
    if(!this.formulario.valid){
      alert("Formulario invalido");
    }

    const categoria = this.formulario.value as CategoriaDTO; 
    console.log(categoria);

    this.categoriasService.crearCategoria(categoria).subscribe(response => {
      console.log(response);
      this.obtenerCategoriasCargarTabla();
    });
  
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
        this.cancelarEdicion(); // Volver al estado inicial después de editar
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
  }

  cancelarEdicion() {
    this.estaEditando = false;
    this.categoriaSeleccionada = null;
    this.formulario.reset(); // Limpiar el formulario
  }

  eliminarCategoria(idEliminar:number){

    this.categoriasService.eliminarCategoria(idEliminar).subscribe( response => {
      console.log(response);
      this.obtenerCategoriasCargarTabla();
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
  
  onInputChange(){
    /*
    setTimeout(()=>{
      console.log('fgdfgdfgd', this.textoBuscar);
    },1000);
    */
    //console.log('fgdfgdfgd', this.textoBuscar);
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


  // validaciones **********************************************************
  obtenerErrorCamposRequeridos() {

    const nombre = this.formulario.controls.nombre;
    const descripcion = this.formulario.controls.descripcion;
  
    if (nombre.hasError('required')) {
      return 'El campo nombre es obligatorio';
    }
    //hacer un metodo para cada input
    if (descripcion.hasError('required')) {
      return 'El campo descripción es obligatorio';
    }

    return ''; // Retorna vacío si no hay errores
  }


}
