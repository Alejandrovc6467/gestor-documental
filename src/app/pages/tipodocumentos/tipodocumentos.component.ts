
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TipodocumentoDTO } from '../../Core/models/TipodocumentoDTO';
import { TipodocumentoService } from '../../Core/services/tipodocumento.service';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl, MatPaginatorModule} from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { CustomMatPaginatorIntlComponent } from '../../Core/components/custom-mat-paginator-intl/custom-mat-paginator-intl.component';
import { EliminarDTO } from '../../Core/models/EliminarDTO';
import { MatTooltipModule } from '@angular/material/tooltip';


@Component({
  selector: 'app-tipodocumentos',
  standalone: true,
  imports: [MatButtonModule,  MatFormFieldModule, ReactiveFormsModule, MatInputModule, MatTableModule, MatPaginatorModule, MatIconModule, FormsModule,  MatTooltipModule],
  templateUrl: './tipodocumentos.component.html',
  styleUrl: './tipodocumentos.component.css',
  providers: [
    { provide: MatPaginatorIntl, useClass: CustomMatPaginatorIntlComponent }
  ]
})
export class TipodocumentosComponent implements OnInit  {

  tipodocumentoService = inject(TipodocumentoService);
  listaCategorias! : TipodocumentoDTO[];
  listCategoriasdataSource = new MatTableDataSource<TipodocumentoDTO>([]);
  displayedColumns: string[] = [ 'acciones', 'nombre', 'descripcion' ];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  textoBuscar: string = "";
  estaEditando: boolean = false;
  categoriaSeleccionada!: TipodocumentoDTO | null;


  ngOnInit(): void {
    this.obtenerCategoriasCargarTabla();
  }
  

  constructor(){}


  private formbuilder = inject(FormBuilder);
  formulario = this.formbuilder.group({
    nombre: ['', [Validators.required, Validators.pattern('^(?!\\s*$)[a-zA-Z0-9 ]+$')]],
    descripcion: ['', [Validators.required]]
  });
  

  //CRUD **********************************************************
  obtenerCategorias(){
    this.tipodocumentoService.obtenerTipoducumentos().subscribe(response => {
      this.listaCategorias = response;
    });
  }

  obtenerCategoriaPorId(idBuscar:number){
    this.tipodocumentoService.obtenerTipodocumentoPorId(idBuscar).subscribe(response => {
      console.log(response);
    });
  }

  guardarCategoria() {
    
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
  



  crearCategoria() {

    if (this.formulario.invalid) {
      return;
    }

    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Deseas crear este Tipo de documento?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, crear',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {

        const categoria = this.formulario.value as TipodocumentoDTO;
        categoria.usuarioID = 1;
        categoria.oficinaID = 1;
      
        this.tipodocumentoService.crearTipodocumento(categoria).subscribe(response => {
          console.log(response);
          if(response){
    
            this.obtenerCategoriasCargarTabla();
            this.limpiarFormulario();
            Swal.fire('Creado!', 'El tipo de documento ha sido creado.', 'success');
    
          }else{
            Swal.fire('Error!', 'El tipo de documento no ha sido creado.', 'error');
          }
          
        });

      }
    });

   
  }
  

  actualizarCategoria() {


    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Deseas actualizar este Tipo de documento?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, actualizar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {

        if (!this.categoriaSeleccionada) return;
        const categoriaActualizada: TipodocumentoDTO = {
          id: this.categoriaSeleccionada.id,
          nombre: this.formulario.value.nombre!,
          descripcion: this.formulario.value.descripcion!,
          usuarioID: 1,
          oficinaID: 1
        };
        this.tipodocumentoService.actualizarTipodocumento(categoriaActualizada).subscribe(response => {
          console.log(response);
          if(response){
  
            this.obtenerCategoriasCargarTabla();
            this.limpiarFormulario();
            Swal.fire('Editado!', 'El tipo de documento ha sido editado.', 'success');
  
          }else{
            Swal.fire('Error!', 'El tipo de documento no ha sido editado.', 'error');
          }
         
        
        });

      }
    });
    

  
  }

  editarCategoria(element: TipodocumentoDTO) {
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



  eliminarCategoria(idEliminar: number) {
    // Mostrar el SweetAlert para confirmar la eliminación
    Swal.fire({
        title: '¿Desea eliminar el tipo de documento?',
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

          console.log(eliminarDTO);

            // Si el usuario confirma, proceder con la eliminación
            this.tipodocumentoService.eliminarTipodocumento(eliminarDTO).subscribe(response => {
                console.log(response);

                if(response){

                  this.obtenerCategoriasCargarTabla();
                  this.limpiarFormulario();
                  Swal.fire('Eliminado!', 'El tipo de documento ha sido eliminado.', 'success');

                }else{
                  Swal.fire('Error!', 'El tipo de documento no ha sido eliminado.', 'error');
                }

              
            });
        }
    });
  }


  

  // Otros **********************************************************

  obtenerCategoriasCargarTabla(){
    this.tipodocumentoService.obtenerTipoducumentos().subscribe(response => {
      this.listaCategorias = response;
      this.setTable(this.listaCategorias);
    });
  }

  setTable(data:TipodocumentoDTO[]){
    this.listCategoriasdataSource = new MatTableDataSource<TipodocumentoDTO>(data);
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

      if (nombre.value?.trim() === "") {
        return 'El campo nombre no puede contener solo espacios';
      }

      return 'El campo nombre solo puede contener letras y números';
    }


    return ''; 

  }

}
