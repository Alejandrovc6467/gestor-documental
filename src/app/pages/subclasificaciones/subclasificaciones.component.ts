


import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { SubclasificacionDTO,SubclasificacionExtendidaDTO } from '../../Core/models/SubclasificacionDTO';
import { ClasificacionDTO } from '../../Core/models/ClasificacionDTO';
import { SubclasificacionesService } from '../../Core/services/subclasificaciones.service';
import { ClasificacionesService } from '../../Core/services/clasificaciones.service';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl, MatPaginatorModule} from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { CustomMatPaginatorIntlComponent } from '../../Core/components/custom-mat-paginator-intl/custom-mat-paginator-intl.component';



@Component({
  selector: 'app-subclasificaciones',
  standalone: true,
  imports: [CommonModule,MatButtonModule,  MatFormFieldModule, MatSelectModule,ReactiveFormsModule, MatInputModule, MatTableModule, MatPaginatorModule, MatIconModule, FormsModule],
  templateUrl: './subclasificaciones.component.html',
  styleUrl: './subclasificaciones.component.css',
  providers: [
    { provide: MatPaginatorIntl, useClass: CustomMatPaginatorIntlComponent }
  ]
})
export class SubclasificacionesComponent implements OnInit {
  
  
  subclasificaionesService = inject(SubclasificacionesService);
  clasificacionesService = inject(ClasificacionesService);
  listaSubclasificaciones! : SubclasificacionDTO[];
  clasificaciones!: ClasificacionDTO[];
  listCategoriasdataSource = new MatTableDataSource<SubclasificacionExtendidaDTO>([]);
  displayedColumns: string[] = [ 'acciones','clasificacion', 'nombre', 'descripcion' ];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  textoBuscar: string = "";
  estaEditando: boolean = false;
  subclasificaionSeleccionada!: SubclasificacionDTO | null;


  ngOnInit(): void {
    this.obtenerClasificaciones();
    this.obtenerCategoriasCargarTabla();
    this.formulario.updateValueAndValidity();
  }
  
  constructor(){}

  private formbuilder = inject(FormBuilder);
  formulario = this.formbuilder.group({
    nombre: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)]],
    descripcion: ['', [Validators.required]],
    clasificacionID: [0, [Validators.required]]
  });

  obtenerClasificaciones(){
    this.clasificacionesService.obtenerClasificaciones().subscribe(response => {
      this.clasificaciones = response;
    })};



  //CRUD **********************************************************
  obtenerCategorias(){
    this.subclasificaionesService.obtenerSubclasificaciones().subscribe(response => {
      this.listaSubclasificaciones = response;
    });



  }

  obtenerCategoriaPorId(idBuscar:number){
    //const idBuscar: number = 1;
    this.subclasificaionesService.obtenerSubclasificacionPorId(idBuscar).subscribe(response => {
      console.log(response);
    });
  }

  crearCategoria(){
    
    if(this.formulario.invalid){
      alert("Formulario invalido");
    }else{

      const categoria = this.formulario.value as SubclasificacionDTO; 
      
      // Asegurarse de que clasificacionId sea un número válido
      categoria.clasificacionID = Number(categoria.clasificacionID);

      categoria.eliminado = false;
      categoria.usuarioID = 1;
      categoria.oficinaID = 1;
      console.log(categoria);
  
      this.subclasificaionesService.crearSubclasificacion(categoria).subscribe(response => {
        console.log(response);
        this.obtenerCategoriasCargarTabla();
        this.formulario.reset();
        this.limpiarErroresFormulario();
        Swal.fire('Creada!', 'La categoría ha sido creada.', 'success');
      });

    }

  
  
  }

  actualizarCategoria() {

    if (!this.subclasificaionSeleccionada) return;
      const subclasificacionActualizada: SubclasificacionDTO = {
        id: this.subclasificaionSeleccionada.id,
        nombre: this.formulario.value.nombre!,
        descripcion: this.formulario.value.descripcion!,
        clasificacionID: this.formulario.value.clasificacionID!,
        eliminado: false,
        usuarioID: 1,
        oficinaID:1
      };

      console.log(this.subclasificaionSeleccionada);
      this.subclasificaionesService.actualizarSubclasificacion(subclasificacionActualizada).subscribe(response => {
        console.log(response);
        this.obtenerCategoriasCargarTabla();
        this.cancelarEdicion();
        this.limpiarErroresFormulario();
        Swal.fire('Editada!', 'La categoría ha sido editada.', 'success');
      });
  }

  editarCategoria(element: SubclasificacionDTO) {
    // Método para cargar los datos de la categoría seleccionada y activar el modo de edición
    this.estaEditando = true;
    this.subclasificaionSeleccionada = element;
    // Cargar los datos de la categoría en el formulario
    this.formulario.patchValue({
      nombre: element.nombre,
      descripcion: element.descripcion,
      clasificacionID: element.clasificacionID
    });
    this.limpiarErroresFormulario();
  }

  cancelarEdicion() {
    this.estaEditando = false;
    this.subclasificaionSeleccionada = null;
    this.formulario.reset(); // Limpiar el formulario
    this.formulario.markAsPristine();  // Marcar como 'pristino'
    this.formulario.markAsUntouched(); // Marcar como 'intacto'
    this.formulario.updateValueAndValidity(); // Recalcular estado de validez
  }


  eliminarCategoria(idEliminar: number) {
    // Mostrar el SweetAlert para confirmar la eliminación
    Swal.fire({
        title: '¿Desea eliminar la Subclasificación?',
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
            this.subclasificaionesService.eliminarSubclasificacion(idEliminar).subscribe(response => {
                console.log(response);
                this.obtenerCategoriasCargarTabla();
                Swal.fire('Eliminado!', 'La Subclasificación ha sido eliminada.', 'success');
            });
        }
    });
  }


  

  // Otros **********************************************************

  obtenerCategoriasCargarTabla(){
    this.subclasificaionesService.obtenerSubclasificaciones().subscribe(response => {
      this.listaSubclasificaciones = response;
      this.setTable(this.listaSubclasificaciones);
    });
  }

  setTable(data:SubclasificacionDTO[]){

    //voy simular una espera con este setTime
    setTimeout(() => {

      // Mapear los datos para agregar el nombre de la clasificación
      const dataConClasificacionNombre: SubclasificacionExtendidaDTO[] = data.map(subclasificacion => {
        const clasificacion = this.clasificaciones.find(clas => clas.id === subclasificacion.clasificacionID);
        return {
          ...subclasificacion,
          clasificacionNombre: clasificacion ? clasificacion.nombre : 'Sin Clasificación'
        };
      });
      // Configurar el DataSource con los datos modificados
      this.listCategoriasdataSource = new MatTableDataSource<SubclasificacionExtendidaDTO>(dataConClasificacionNombre);
      this.listCategoriasdataSource.paginator = this.paginator;

    }, 3000);
  }
  
  realizarBusqueda() {
    this.filtrarData();
  }

  filtrarData(){

    const data = this.listaSubclasificaciones.slice();
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
      this.setTable(this.listaSubclasificaciones);
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

  obtenerErrorClasificacionId() {
    const clasificacionId = this.formulario.controls.clasificacionID;
  
    if (clasificacionId.hasError('required')) {
      return 'El campo clasificación es obligatorio';
    }
  
    return '';
  }

}
