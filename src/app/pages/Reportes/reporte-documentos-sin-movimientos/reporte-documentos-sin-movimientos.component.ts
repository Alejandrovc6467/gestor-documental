
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NormaDTO } from '../../../Core/models/NormaDTO';
import { NormasService } from '../../../Core/services/normas.service';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-reporte-documentos-sin-movimientos',
  standalone: true,
  imports: [MatButtonModule,  MatFormFieldModule, ReactiveFormsModule, MatInputModule, MatTableModule, MatPaginatorModule, MatIconModule, FormsModule],
  templateUrl: './reporte-documentos-sin-movimientos.component.html',
  styleUrl: './reporte-documentos-sin-movimientos.component.css'
})
export class ReporteDocumentosSinMovimientosComponent {


  normasService = inject(NormasService);
  listaCategorias! : NormaDTO[];
  listCategoriasdataSource = new MatTableDataSource<NormaDTO>([]);
  displayedColumns: string[] = [ 'acciones', 'nombre', 'descripcion' ];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  textoBuscar: string = "";
  estaEditando: boolean = false;
  categoriaSeleccionada!: NormaDTO | null;


  ngOnInit(): void {
    this.obtenerNormasCargarTabla();
    this.formulario.updateValueAndValidity();
  }
  
  constructor(){}

  private formbuilder = inject(FormBuilder);
  formulario = this.formbuilder.group({
    nombre: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)]],
    descripcion: ['', [Validators.required]]
  });



  //CRUD **********************************************************
  obtenerNormas(){
    this.normasService.obtenerNormas().subscribe(response => {
      this.listaCategorias = response;
    });
  }

  obtenerNormaPorId(idBuscar:number){
    //const idBuscar: number = 1;
    this.normasService.obtenerNormasPorId(idBuscar).subscribe(response => {
      console.log(response);
    });
  }

  crearNorma(){
    
    if(this.formulario.invalid){
      alert("Formulario invalido");
    }else{

      const categoria = this.formulario.value as NormaDTO; 
      categoria.usuarioID = 1;
      categoria.oficinaID = 1;
      console.log(categoria);
  
      this.normasService.crearNorma(categoria).subscribe(response => {
        console.log(response);
        this.obtenerNormasCargarTabla();
        this.formulario.reset();
        this.limpiarErroresFormulario();
        Swal.fire('Creada!', 'La norma ha sido creada.', 'success');
      });

    }

  
  
  }

  actualizarNorma() {
    if (!this.categoriaSeleccionada) return;
      const categoriaActualizada: NormaDTO = {
        id: this.categoriaSeleccionada.id,
        nombre: this.formulario.value.nombre!,
        descripcion: this.formulario.value.descripcion!,
        usuarioID : 1,
        oficinaID :1
      };
      this.normasService.actualizarNorma(categoriaActualizada).subscribe(response => {
        console.log(response);
        this.obtenerNormasCargarTabla();
        this.cancelarEdicion();
        this.limpiarErroresFormulario();
        Swal.fire('Editada!', 'La norma ha sido editada.', 'success');
      });
  }

  editarNorma(element: NormaDTO) {
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

    this.normasService.eliminarCategoria(idEliminar).subscribe( response => {
      console.log(response);
      this.obtenerNormasCargarTabla();
    });
    
  }
    */

  eliminarNorma(idEliminar: number) {
    // Mostrar el SweetAlert para confirmar la eliminación
    Swal.fire({
        title: '¿Desea eliminar la norma?',
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
            this.normasService.eliminarNorma(idEliminar).subscribe(response => {
                console.log(response);
                this.obtenerNormasCargarTabla();
                Swal.fire('Eliminado!', 'La norma ha sido eliminada.', 'success');
            });
        }
    });
  }


  

  // Otros **********************************************************

  obtenerNormasCargarTabla(){
    this.normasService.obtenerNormas().subscribe(response => {
      this.listaCategorias = response;
      this.setTable(this.listaCategorias);
    });
  }

  setTable(data:NormaDTO[]){
    this.listCategoriasdataSource = new MatTableDataSource<NormaDTO>(data);
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
