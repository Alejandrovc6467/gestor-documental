
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NormaDTO } from '../../Core/models/NormaDTO';
import { NormasService } from '../../Core/services/normas.service';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl, MatPaginatorModule} from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { CustomMatPaginatorIntlComponent } from '../../Core/components/custom-mat-paginator-intl/custom-mat-paginator-intl.component';
import { EliminarDTO } from '../../Core/models/EliminarDTO';
import { MatTooltipModule } from '@angular/material/tooltip';


@Component({
  selector: 'app-normas',
  standalone: true,
  imports: [MatButtonModule,  MatFormFieldModule, ReactiveFormsModule, MatInputModule, MatTableModule, MatPaginatorModule, MatIconModule, FormsModule, MatTooltipModule ],
  templateUrl: './normas.component.html',
  styleUrl: './normas.component.css',
  providers: [
    { provide: MatPaginatorIntl, useClass: CustomMatPaginatorIntlComponent }
  ]
})
export class NormasComponent  implements OnInit{

  normasService = inject(NormasService);
  listaCategorias! : NormaDTO[];
  listCategoriasdataSource = new MatTableDataSource<NormaDTO>([]);
  displayedColumns: string[] = [ 'acciones', 'nombre', 'descripcion' ];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  textoBuscar: string = "";
  estaEditando: boolean = false;
  categoriaSeleccionada!: NormaDTO | null;

  usuarioIDLogin: number = Number(localStorage.getItem('usuarioID'));
  oficinaIDLogin: number = Number(localStorage.getItem('oficinaSeleccionadaId'));


  ngOnInit(): void {
    // this.obtenerNormasCargarTabla();
  }
  

  constructor(){}


  private formbuilder = inject(FormBuilder);
  formulario = this.formbuilder.group({
    nombre: ['', [Validators.required, Validators.pattern('^(?!\\s*$)[a-zA-Z0-9 ]+$')]],
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


  
  guardarNorma() {
    
    if (this.formulario.invalid) {
      return;
    }

    this.marcarErrores();
    
    if (this.estaEditando) {
      this.actualizarNorma();
    } else {
      this.crearNorma();
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

  crearNorma(){
    
    if (this.formulario.invalid) {
      return;
    }

    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Deseas crear la norma?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, crear',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {

        const categoria = this.formulario.value as NormaDTO; 
        categoria.usuarioID = this.usuarioIDLogin;
        categoria.oficinaID = this.oficinaIDLogin;
        console.log(categoria);
    
        this.normasService.crearNorma(categoria).subscribe(response => {
          console.log(response);
          if(response){
            this.limpiarTabla();
            this.limpiarFormulario();
            Swal.fire('Creada!', 'La norma ha sido creada.', 'success');
          }else{
            Swal.fire('Error!', 'La norma no ha sido creada.', 'error');
          }
        
        });
    
      }
    });
    
     
    

  
  
  }

  actualizarNorma() {

    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Deseas actualizar la norma?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, actualizar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {

        if (!this.categoriaSeleccionada) return;
        const categoriaActualizada: NormaDTO = {
          id: this.categoriaSeleccionada.id,
          nombre: this.formulario.value.nombre!,
          descripcion: this.formulario.value.descripcion!,
          usuarioID : this.usuarioIDLogin,
          oficinaID :this.oficinaIDLogin
        };
        this.normasService.actualizarNorma(categoriaActualizada).subscribe(response => {
          console.log(response);
          if(response){
            this.limpiarTabla();
            this.limpiarFormulario();
            Swal.fire('Editada!', 'La norma ha sido editada.', 'success');
          }else{
            Swal.fire('Error!', 'La norma no ha sido editada.', 'error');
          }
          
        });

      }
    });


  }

  editarNorma(element: NormaDTO) {
   
    this.estaEditando = true;
    this.categoriaSeleccionada = element;
    this.formulario.patchValue({
      nombre: element.nombre,
      descripcion: element.descripcion
    });

    this.categoriaSeleccionada.usuarioID = this.usuarioIDLogin;
    this.categoriaSeleccionada.oficinaID = this.oficinaIDLogin;
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




  eliminarNorma(idEliminar: number) {


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


          const eliminarDTO:  EliminarDTO = {
            objetoID: idEliminar,
            usuarioID: this.usuarioIDLogin,// esto sale del local
            oficinaID: this.oficinaIDLogin// y este
          };

            // Si el usuario confirma, proceder con la eliminación
            this.normasService.eliminarNorma(eliminarDTO).subscribe(response => {
                console.log(response);
                if(response){
                  this.limpiarTabla();
                  this.limpiarFormulario();
                  Swal.fire('Eliminado!', 'La norma ha sido eliminada.', 'success');
                }else{
                  Swal.fire('Error!', 'La norma no ha sido eliminada.', 'error');
                }
               
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
  
  limpiarTabla(){
    this.listaCategorias = [];
    this.setTable([]);
  }
  
  
  realizarBusqueda() {
    this.limpiarTabla();
    this.obtenerNormas();
    this.filtrarData();
  }

  filtrarData() {
   
    setTimeout(() => {
      const data = this.listaCategorias.slice();

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
