
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
import { EliminarDTO } from '../../Core/models/EliminarDTO';
import { MatTooltipModule } from '@angular/material/tooltip';


@Component({
  selector: 'app-doctos',
  standalone: true,
  imports: [MatButtonModule,  MatFormFieldModule, ReactiveFormsModule, MatInputModule, MatTableModule, MatPaginatorModule, MatIconModule, FormsModule,  MatTooltipModule],
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
    // this.obtenerCategoriasCargarTabla();
    this.setTable([]);
    this.obtenerDoctocs();
  }
  

  constructor(){}


  private formbuilder = inject(FormBuilder);
  formulario = this.formbuilder.group({
    nombre: ['', [Validators.required, Validators.pattern('^(?!\\s*$)[a-zA-Z0-9 ]+$')]],
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

  guardarDoctoc() {
    
    if (this.formulario.invalid) {
      return;
    }

    this.marcarErrores();
    
    if (this.estaEditando) {
      this.actualizarDoctoc();
    } else {
      this.crearDoctoc();
    }
  }

  marcarErrores() {
    // Lista de los campos requeridos
    const camposRequeridos = ['nombre', 'descripcion'];
  
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


  crearDoctoc(){
    
    if (this.formulario.invalid) {
      return;
    }

    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Deseas crear este Docto?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, crear',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {

        const categoria = this.formulario.value as DoctocDTO; 
        categoria.usuarioID = 1;
        categoria.oficinaID = 1;
        console.log(categoria);
      
        this.doctocService.crearDoctoc(categoria).subscribe(response => {
          console.log(response);
          if(response){
            // this.obtenerCategoriasCargarTabla();
            this.limpiarFormulario();
            Swal.fire('Creado!', 'El Doctoc ha sido creado.', 'success');
          }else{
            Swal.fire('Error!', 'El Doctoc no ha sido creado.', 'success');
          }
         
        });

      }
    });
    
  }

  actualizarDoctoc() {

    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Deseas actualizar este docto?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, actualizar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {

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
          if(response){
            // this.obtenerCategoriasCargarTabla();
            this.limpiarFormulario();
            Swal.fire('Editado!', 'El Doctoc ha sido editado.', 'success');
          }else{
            Swal.fire('Error!', 'El Doctoc no ha sido editado.', 'error');
          }
          
        });

      }
    });    

   
  }

  editarDoctoc(element: DoctocDTO) {
  
    this.estaEditando = true;
    this.categoriaSeleccionada = element;
    this.formulario.patchValue({
      nombre: element.nombre,
      descripcion: element.descripcion
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
    
    const camposRequeridos: string[] = ['nombre', 'descripcion'];
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
    this.categoriaSeleccionada = null;

  }
  

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

          const eliminarDTO:  EliminarDTO = {
            objetoID: idEliminar,
            usuarioID: 1,// esto sale del local
            oficinaID: 1// y este
          };

            // Si el usuario confirma, proceder con la eliminación
            this.doctocService.eliminarDoctoc(eliminarDTO).subscribe(response => {
                console.log(response);
                if(response){
                  // this.obtenerCategoriasCargarTabla();
                  this.limpiarFormulario();
                  Swal.fire('Eliminado!', 'El Doctoc ha sido eliminado.', 'success');
                }else{
                  Swal.fire('Error!', 'El Doctoc no ha sido eliminado.', 'error');
                }
                
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


  filtrarData() {
    const data = this.listaCategorias.slice();
    setTimeout(() => {
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
  


}
