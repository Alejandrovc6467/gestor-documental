
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
import { EliminarDTO } from '../../Core/models/EliminarDTO';
import { MatTooltipModule } from '@angular/material/tooltip';


@Component({
  selector: 'app-subclasificaciones',
  standalone: true,
  imports: [CommonModule,MatButtonModule,  MatFormFieldModule, MatSelectModule,ReactiveFormsModule, MatInputModule, MatTableModule, MatPaginatorModule, MatIconModule, FormsModule,MatTooltipModule ],
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
    // this.obtenerCategoriasCargarTabla();
    this.obtenerClasificaciones();
   
  }
  
  constructor(){}


  private formbuilder = inject(FormBuilder);
  formulario = this.formbuilder.group({
    nombre: ['', [Validators.required, Validators.pattern('^(?!\\s*$)[a-zA-Z0-9 ]+$')]],
    descripcion: ['', [Validators.required]],
    clasificacionID: [0, [Validators.required]]
  });

  obtenerClasificaciones(){
    this.clasificacionesService.obtenerClasificaciones().subscribe(response => {
      this.clasificaciones = response;
  })};



  //CRUD **********************************************************
  obtenerSubclasificaciones(){
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

  guardarSubclasificacion() {
    
    if (this.formulario.invalid) {
      return;
    }

    this.marcarErrores();
    
    if (this.estaEditando) {
      this.actualizarCategoria();
    } else {
      this.crearCategoria();
    }
  }


  marcarErrores() {
    // Lista de los campos requeridos
    const camposRequeridos = ['nombre', 'descripcion', 'clasificacionID'];
  
    camposRequeridos.forEach(campo => {
      const control = this.formulario.get(campo);
  
      // Marca el campo como tocado
      control?.markAsTouched();
  
      // Si el campo está vacío, establece el error de 'required'
      if (!control?.value) {
        control?.setErrors({ required: true, pattern: true });
      }
    });
  }
  

  crearCategoria(){
    
    if (this.formulario.invalid) {
      return;
    }


    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Deseas crear la subclasificación?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, crear',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {

        const categoria = this.formulario.value as SubclasificacionDTO; 
          
        // Asegurarse de que clasificacionId sea un número válido
        categoria.clasificacionID = Number(categoria.clasificacionID);

        categoria.eliminado = false;
        categoria.usuarioID = 1;
        categoria.oficinaID = 1;
        console.log(categoria);
      
        this.subclasificaionesService.crearSubclasificacion(categoria).subscribe(response => {
          console.log(response);
          if(response){
           
            this.limpiarTabla();
            this.limpiarFormulario();
            Swal.fire('Creada!', 'La subclasificación ha sido creada.', 'success');
          }else{
            Swal.fire('Error!', 'La subclasificación no ha sido creada.', 'error');
          }
          
        });

      }
    });
  
  }


  actualizarCategoria() {

    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Deseas actualizar la subclasificación?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, actualizar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {

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
          if(response){
           
            this.limpiarTabla();
            this.limpiarFormulario();
            Swal.fire('Editada!', 'La subclasificación ha sido editada.', 'success');
          }else{
            Swal.fire('Error!', 'La subclasificación no ha sido editada.', 'error');
          }
        
        });

      }
    });

    
  }

  editarCategoria(element: SubclasificacionDTO) {
    this.estaEditando = true;
    this.subclasificaionSeleccionada = element;
    this.formulario.patchValue({
      nombre: element.nombre,
      descripcion: element.descripcion,
      clasificacionID: element.clasificacionID
    });
  
    // Marcar como pristine después de cargar los datos
    this.formulario.markAsPristine();
    // Marcar como untouched para evitar mensajes de error
    Object.keys(this.formulario.controls).forEach(key => {
       const control = this.formulario.get(key);
       if (control) {
         control.markAsUntouched();
       }
    });

  }
  

  limpiarFormulario(){
    
    const camposRequeridos: string[] = ['nombre', 'descripcion', 'clasificacionID'];
    camposRequeridos.forEach(campo => {
      const control = this.formulario.get(campo);
      if (control) {
        control.setValue('');//limpiar todos los campos
      }
    });

  
   //limpiar los errores del formulario
   Object.keys(this.formulario.controls).forEach(key => {
    this.formulario.get(key)?.setErrors(null); // Eliminar los errores de cada control
   });

   this.formulario.updateValueAndValidity();

    // Reseteamos los estados del componente
    this.estaEditando = false;
    this.subclasificaionSeleccionada = null;

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


          const eliminarDTO:  EliminarDTO = {
            objetoID: idEliminar,
            usuarioID: 1,// esto sale del local
            oficinaID: 1// y este
          };

            // Si el usuario confirma, proceder con la eliminación
            this.subclasificaionesService.eliminarSubclasificacion(eliminarDTO).subscribe(response => {
                console.log(response);
                if(response){
                  
                  this.limpiarTabla();
                  this.limpiarFormulario();
                  Swal.fire('Eliminado!', 'La Subclasificación ha sido eliminada.', 'success');
                }else{
                  Swal.fire('Error!', 'La Subclasificación no ha sido eliminada.', 'error');
                }
               
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
  

  limpiarTabla(){
    this.listaSubclasificaciones = [];
    this.setTable([]);
  }
 
  realizarBusqueda() {
    this.limpiarTabla();
    this.obtenerSubclasificaciones();
    this.filtrarData();
  }

  filtrarData() {
    
    setTimeout(() => {
      const data = this.listaSubclasificaciones.slice();
      const dataFiltrada = data.filter(item => {
        return item.nombre.toLowerCase().includes(this.textoBuscar.toLowerCase());
      });

      this.setTable(dataFiltrada);
    }, 1000); 
  }

  onSearchChange(event: any) {
    const filterValue = (event.target.value || '').trim();
    this.textoBuscar = filterValue;
    
    /*  // Con esto lo hago sin necesidad de presionar el boton buscar
    if (!filterValue) {
      this.setTable([]);
      return;
    }
    this.filtrarData(); 
    */
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

      if (nombre.value?.trim() === "") {
        return 'El campo nombre no puede contener solo espacios';
      }

      return 'El campo nombre solo puede contener letras y números';
    }


    return ''; 

  }



  obtenerErrorClasificacionId() {
    const clasificacionId = this.formulario.controls.clasificacionID;
  
    if (clasificacionId.hasError('required')) {
      return 'El campo clasificación es obligatorio';
    }
  
    return '';
  }

}
