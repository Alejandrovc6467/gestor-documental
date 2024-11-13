
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { EtapaDTO, EtapaExtendidaDTO} from '../../Core/models/EtapaDTO';
import { NormaDTO } from '../../Core/models/NormaDTO';
import { EtapasService } from '../../Core/services/etapas.service';
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
  selector: 'app-etapas',
  standalone: true,
  imports: [CommonModule,MatButtonModule,  MatFormFieldModule, MatSelectModule,ReactiveFormsModule, MatInputModule, MatTableModule, MatPaginatorModule, MatIconModule, FormsModule, MatTooltipModule],
  templateUrl: './etapas.component.html',
  styleUrl: './etapas.component.css',
  providers: [
    { provide: MatPaginatorIntl, useClass: CustomMatPaginatorIntlComponent }
  ]
})
export class EtapasComponent implements OnInit{

  etapasService = inject(EtapasService);
  normasService = inject(NormasService);
  listaEtapas! : EtapaDTO[];
  listaEtapasPadre! : EtapaDTO[];
  listaNormas!: NormaDTO[];
  listEtapasDataSource = new MatTableDataSource<EtapaExtendidaDTO>([]);
  displayedColumns: string[] = [ 'acciones', 'color', 'consecutivo','nombre', 'descripcion', 'norma', 'etapapadre'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  textoBuscar: string = "";
  estaEditando: boolean = false;
  categoriaSeleccionada!: EtapaDTO | null;


  ngOnInit(): void {
    this.obtenerCategoriasCargarTabla();
    this.obtenerEtapasHuerfanas();
    this.obtenerNormas();
    this.obtenerEtapas();
  }


  constructor(){}


  private formbuilder = inject(FormBuilder);
  formulario = this.formbuilder.group({
    nombre: ['', [Validators.required, Validators.pattern('^(?!\\s*$)[a-zA-Z0-9 ]+$')]],
    descripcion: ['', [Validators.required]],
    color: ['#ff0000', [Validators.required]],
    etapaPadreID: [0],
    normaID: [0, [Validators.required]]
  });



  //CRUD **********************************************************
  obtenerCategorias(){
    this.etapasService.obtenerEtapas().subscribe(response => {
      this.listaEtapas = response;
    });

  }

  obtenerCategoriaPorId(idBuscar:number){
    //const idBuscar: number = 1;
    this.etapasService.obtenerEtapasPorId(idBuscar).subscribe(response => {
      console.log(response);
    });
  }


  guardarEtapa() {
    
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
    const camposRequeridos = ['nombre', 'descripcion', 'color',  'normaID'  ];
  
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
      text: '¿Deseas crear esta etapa?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, crear',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {


        const etapa = this.formulario.value as EtapaDTO; 
      
    
        etapa.eliminado = false;
        etapa.usuarioID = 1;
        etapa.oficinaID = 1;
    
        console.log(etapa);
      
        this.etapasService.crearEtapa(etapa).subscribe(response => {
            console.log(response);
            if(response){
              this.obtenerCategoriasCargarTabla();
              this.obtenerEtapasHuerfanas();
              this.limpiarFormulario();
              Swal.fire('Creada!', 'La Etapa ha sido creada.', 'success');
            }else{
              Swal.fire('Error!', 'La Etapa no ha sido creada.', 'error');
            }
           
        });

      }
    });

  

 
  
  }

  actualizarCategoria() {


    
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Deseas actualizar la etapa?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, actualizar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {


        if (!this.categoriaSeleccionada) return;
          const categoriaActualizada: EtapaDTO = {
            id: this.categoriaSeleccionada.id,
            nombre: this.formulario.value.nombre!,
            descripcion: this.formulario.value.descripcion!,
            eliminado: false,
            color: this.formulario.value.color!,
            etapaPadreID: this.formulario.value.etapaPadreID!,
            normaID: this.formulario.value.normaID!,
            usuarioID:1,
            oficinaID:1,
            consecutivo: this.categoriaSeleccionada.consecutivo
          };
          this.etapasService.actualizarEtapa(categoriaActualizada).subscribe(response => {
            console.log(response);
            if(response){
              this.obtenerCategoriasCargarTabla();
              this.limpiarFormulario();
              Swal.fire('Editada!', 'La etapa ha sido editada.', 'success');
            }else{
              Swal.fire('Error!', 'La etapa no ha sido editada.', 'error');
            }
          
          });

      
      }
    });

  }

  editarCategoria(element: EtapaDTO) {
   
    this.estaEditando = true;
    this.categoriaSeleccionada = element;
    this.formulario.patchValue({
      nombre: element.nombre,
      descripcion: element.descripcion,
      color: element.color,
      etapaPadreID: element.etapaPadreID,
      normaID: element.normaID
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
    
    const camposRequeridos: string[] = ['nombre', 'descripcion', 'color', 'etapaPadreID', 'normaID'];
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

    console.log(idEliminar);
  
    Swal.fire({
        title: '¿Desea eliminar la Etapa?',
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
            this.etapasService.eliminarEtapa(eliminarDTO).subscribe(response => {
                console.log(response);
                if(response){
                  this.obtenerCategoriasCargarTabla();
                  this.limpiarFormulario();
                  Swal.fire('Eliminado!', 'La etapa ha sido eliminada.', 'success');
                }else{
                  Swal.fire('Error!', 'La etapa no ha sido eliminada.', 'error');
                }
                
            });
        }
    });
  }


  

  // Otros **********************************************************
  obtenerEtapas(){
    this.etapasService.obtenerEtapas().subscribe(response => {
      this.listaEtapas = response;
    });
  }
  
  obtenerNormas(){
    this.normasService.obtenerNormas().subscribe(response => {
      this.listaNormas = response;
  })};

  obtenerEtapasHuerfanas(){
    this.etapasService.obtenerEtapasHuerfanas().subscribe(response => {
      this.listaEtapasPadre = response;
    });
  }

  obtenerCategoriasCargarTabla(){
    this.etapasService.obtenerEtapas().subscribe(response => {
      this.listaEtapas = response;
      this.setTable(this.listaEtapas);
    });
  }

  setTable(data: EtapaDTO[]) {
    console.log(data);
    setTimeout(() => {
      // Mapear los datos para agregar el nombre de la norma y el nombre de la etapa padre
      const dataConNormaYPadreNombre: EtapaExtendidaDTO[] = data.map(etapa => {
        const clasificacion = this.listaNormas.find(clas => clas.id === etapa.normaID);
  
        // Buscar el nombre de la etapa padre si existe
        const etapaPadre = this.listaEtapas.find(e => e.id === etapa.etapaPadreID);
  
        return {
          ...etapa,
          normaNombre: clasificacion ? clasificacion.nombre : 'Sin norma',
          etapaPadreNombre: etapaPadre ? etapaPadre.nombre : 'Sin etapa padre'  // Asignar el nombre de la etapa padre
        };
      });
  
      // Configurar el DataSource con los datos modificados
      this.listEtapasDataSource = new MatTableDataSource<EtapaExtendidaDTO>(dataConNormaYPadreNombre);
      this.listEtapasDataSource.paginator = this.paginator;
  
    }, 3000);
  }
  
  realizarBusqueda() {
    this.filtrarData();
  }

  filtrarData(){

    const data = this.listaEtapas.slice();
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
      this.setTable(this.listaEtapas);
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



  obtenerErrorNormaId() {
    const normaID = this.formulario.controls.normaID;
  
    if (normaID.hasError('required')) {
      return 'El campo norma es obligatorio';
    }
  
    return '';
  }


  obtenerErrorEtapaId() {
    const etapaPadreID = this.formulario.controls.etapaPadreID;
  
    if (etapaPadreID.hasError('required')) {
      return 'El campo etapa es obligatorio';
    }
  
    return '';
  }
}
