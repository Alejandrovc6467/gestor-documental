

import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DoctocDTO } from '../../Core/models/DoctocDTO';
import { DoctocsService } from '../../Core/services/doctocs.service';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl, MatPaginatorModule} from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { CustomMatPaginatorIntlComponent } from '../../Core/components/custom-mat-paginator-intl/custom-mat-paginator-intl.component';



@Component({
  selector: 'app-doctos',
  standalone: true,
  imports: [MatButtonModule,  MatFormFieldModule, ReactiveFormsModule, MatInputModule, MatTableModule, MatPaginatorModule, MatIconModule, FormsModule],
  templateUrl: './doctos.component.html',
  styleUrl: './doctos.component.css',
  providers: [
    { provide: MatPaginatorIntl, useClass: CustomMatPaginatorIntlComponent }
  ]
})
export class DoctosComponent implements OnInit  {

  doctocService = inject(DoctocsService);
  listaCategorias! : DoctocDTO[];
  listCategoriasdataSource = new MatTableDataSource<DoctocDTO>([]);
  displayedColumns: string[] = [ 'acciones', 'nombre', 'descripcion' ];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  textoBuscar: string = "";
  estaEditando: boolean = false;
  categoriaSeleccionada!: DoctocDTO | null;


  ngOnInit(): void {
    this.obtenerCategoriasCargarTabla();
    this.formulario.updateValueAndValidity();
  }
  
  constructor(){}

  private formbuilder = inject(FormBuilder);
  formulario = this.formbuilder.group({
    nombre: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)]],
    descripcion: ['', [Validators.required]]
  });



  //CRUD **********************************************************
  obtenerDoctocs(){
    this.doctocService.obtenerDoctocs().subscribe(response => {
      this.listaCategorias = response;
    });
  }

  obtenerDoctocPorId(idBuscar:number){
    //const idBuscar: number = 1;
    this.doctocService.obtenerDoctocPorId(idBuscar).subscribe(response => {
      console.log(response);
    });
  }

  crearDoctoc(){
    
    if(this.formulario.invalid){
      alert("Formulario invalido");
    }else{

      const categoria = this.formulario.value as DoctocDTO; 
      categoria.usuarioID = 1;
      categoria.oficinaID = 1;
      console.log(categoria);
  
      this.doctocService.crearDoctoc(categoria).subscribe(response => {
        console.log(response);
        this.obtenerCategoriasCargarTabla();
        this.formulario.reset();
        this.limpiarErroresFormulario();
        Swal.fire('Creado!', 'El Doctoc ha sido creado.', 'success');
      });

    }

  
  
  }

  actualizarDoctoc() {
    if (!this.categoriaSeleccionada) return;
      const categoriaActualizada: DoctocDTO = {
        id: this.categoriaSeleccionada.id,
        nombre: this.formulario.value.nombre!,
        descripcion: this.formulario.value.descripcion!,
        usuarioID: 1,
        oficinaID: 1
      };
      this.doctocService.actualizarDoctoc(categoriaActualizada).subscribe(response => {
        console.log(response);
        this.obtenerCategoriasCargarTabla();
        this.cancelarEdicion();
        this.limpiarErroresFormulario();
        Swal.fire('Editado!', 'El Doctoc ha sido editado.', 'success');
      });
  }

  editarDoctoc(element: DoctocDTO) {
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

  /*
  eliminarCategoria(idEliminar:number){

    this.doctocService.eliminarCategoria(idEliminar).subscribe( response => {
      console.log(response);
      this.obtenerCategoriasCargarTabla();
    });
    
  }
    */

  eliminarDoctoc(idEliminar: number) {
    // Mostrar el SweetAlert para confirmar la eliminación
    Swal.fire({
        title: '¿Desea eliminar el Doctoc?',
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
            this.doctocService.eliminarDoctoc(idEliminar).subscribe(response => {
                console.log(response);
                this.obtenerCategoriasCargarTabla();
                Swal.fire('Eliminado!', 'El Doctoc ha sido eliminado.', 'success');
            });
        }
    });
  }


  

  // Otros **********************************************************

  obtenerCategoriasCargarTabla(){
    this.doctocService.obtenerDoctocs().subscribe(response => {
      this.listaCategorias = response;
      this.setTable(this.listaCategorias);
    });
  }

  setTable(data:DoctocDTO[]){
    this.listCategoriasdataSource = new MatTableDataSource<DoctocDTO>(data);
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


}
