
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
import { MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-etapas',
  standalone: true,
  imports: [CommonModule,MatButtonModule,  MatFormFieldModule, MatSelectModule,ReactiveFormsModule, MatInputModule, MatTableModule, MatPaginatorModule, MatIconModule, FormsModule],
  templateUrl: './etapas.component.html',
  styleUrl: './etapas.component.css'
})
export class EtapasComponent implements OnInit{
  etapasService = inject(EtapasService);
  normasService = inject(NormasService);
  listaCategorias! : EtapaDTO[];
  normas!: NormaDTO[];
  listCategoriasdataSource = new MatTableDataSource<EtapaExtendidaDTO>([]);
  displayedColumns: string[] = [ 'acciones', 'nombre', 'descripcion', 'clasificacion', 'color'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  textoBuscar: string = "";
  estaEditando: boolean = false;
  categoriaSeleccionada!: EtapaDTO | null;


  ngOnInit(): void {
    //this.obtenerCategoriasCargarTabla();
    this.formulario.updateValueAndValidity();
    this.obtenerNormas();
    this.obtenerEtapas();
   
  }

  constructor(){}

  private formbuilder = inject(FormBuilder);
  formulario = this.formbuilder.group({
    nombre: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)]],
    descripcion: ['', [Validators.required]],
    clasificacionId: [0, [Validators.required]],
    color: ['#ff0000', [Validators.required]]
  });

  obtenerNormas(){
    this.normasService.obtenerNormas().subscribe(response => {
      this.normas = response;
    })};

  //CRUD **********************************************************
  obtenerCategorias(){
    this.etapasService.obtenerEtapas().subscribe(response => {
      this.listaCategorias = response;
    });



  }

  obtenerCategoriaPorId(idBuscar:number){
    //const idBuscar: number = 1;
    this.etapasService.obtenerEtapasPorId(idBuscar).subscribe(response => {
      console.log(response);
    });
  }

  crearCategoria(){
    
    if(this.formulario.invalid){
      alert("Formulario invalido");
    }else{

      const etapa = this.formulario.value as EtapaDTO; 
      
      // Asegurarse de que clasificacionId sea un número válido
      etapa.normaId = Number(etapa.normaId);

      console.log(etapa);
  
      this.etapasService.crearEtapa(etapa).subscribe(response => {
        console.log(response);
        this.obtenerCategoriasCargarTabla();
        this.formulario.reset();
        this.limpiarErroresFormulario();
        Swal.fire('Creada!', 'La categoría ha sido creada.', 'success');
      });

    }

  
  
  }

  actualizarCategoria() {
    if (!this.categoriaSeleccionada) return;
      const categoriaActualizada: EtapaDTO = {
        id: this.categoriaSeleccionada.id,
        nombre: this.formulario.value.nombre!,
        descripcion: this.formulario.value.descripcion!,
        normaId: this.formulario.value.clasificacionId!
      };
      this.etapasService.actualizarEtapa(categoriaActualizada).subscribe(response => {
        console.log(response);
        this.obtenerCategoriasCargarTabla();
        this.cancelarEdicion();
        this.limpiarErroresFormulario();
        Swal.fire('Editada!', 'La categoría ha sido editada.', 'success');
      });
  }

  editarCategoria(element: EtapaDTO) {
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
            this.etapasService.eliminarEtapa(idEliminar).subscribe(response => {
                console.log(response);
                this.obtenerCategoriasCargarTabla();
                Swal.fire('Eliminado!', 'La etapa ha sido eliminada.', 'success');
            });
        }
    });
  }


  

  // Otros **********************************************************
  obtenerEtapas(){
    this.etapasService.obtenerEtapas().subscribe(response => {
      this.listaCategorias = response;
    });
  }

  obtenerCategoriasCargarTabla(){
    this.etapasService.obtenerEtapas().subscribe(response => {
      this.listaCategorias = response;
      this.setTable(this.listaCategorias);
    });
  }

  setTable(data:EtapaDTO[]){
   // Mapear los datos para agregar el nombre de la clasificación
  const dataConClasificacionNombre: EtapaExtendidaDTO[] = data.map(subcategoria => {
    const clasificacion = this.normas.find(clas => clas.id === subcategoria.normaId);
    return {
      ...subcategoria,
      normaNombre: clasificacion ? clasificacion.nombre : 'Sin norma'
    };
  });

  // Configurar el DataSource con los datos modificados
  this.listCategoriasdataSource = new MatTableDataSource<EtapaExtendidaDTO>(dataConClasificacionNombre);
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

  obtenerErrorClasificacionId() {
    const clasificacionId = this.formulario.controls.clasificacionId;
  
    if (clasificacionId.hasError('required')) {
      return 'El campo clasificación es obligatorio';
    }
  
    return '';
  }
}
