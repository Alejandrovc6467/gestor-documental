

import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CategoriaDTO } from '../../Core/models/CategoriaDTO';
import { CategoriasService } from '../../Core/services/categorias.service';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { RouterLink } from '@angular/router';
import { NormasService } from '../../Core/services/normas.service';
import { TipodocumentoService } from '../../Core/services/tipodocumento.service';
import { DoctocsService } from '../../Core/services/doctocs.service';
import { FiltroVerticalService } from '../../Core/services/filtro-vertical.service';
import { ClasificacionesService } from '../../Core/services/clasificaciones.service';
import { TipodocumentoDTO } from '../../Core/models/TipodocumentoDTO';
import { DoctocDTO } from '../../Core/models/DoctocDTO';
import { ClasificacionDTO } from '../../Core/models/ClasificacionDTO';
import { MatSelectModule } from '@angular/material/select';
import { FiltroVerticalGetDTO } from '../../Core/models/FiltroVerticalGetDTO';

@Component({
  selector: 'app-filtro-vertical',
  standalone: true,
  imports: [MatButtonModule, RouterLink,  MatFormFieldModule, MatSelectModule, ReactiveFormsModule, MatInputModule, MatTableModule, MatPaginatorModule, MatIconModule, FormsModule],
  templateUrl: './filtro-vertical.component.html',
  styleUrl: './filtro-vertical.component.css'
})
export class FiltroVerticalComponent {


  filtroVerticalService = inject(FiltroVerticalService);
  normasService = inject(NormasService);
  tipodocumentoService = inject(TipodocumentoService);
  categoriasService = inject(CategoriasService);
  //falta Oficinas service, despues del modulo de seguridad
  doctocsService = inject(DoctocsService);
  clasificacionesService = inject(ClasificacionesService);


  
  listaNormas! : CategoriaDTO[];
  listaTipoDocumentos! : TipodocumentoDTO[];
  listaDocumentos! : FiltroVerticalGetDTO[];
  listaCategorias! : CategoriaDTO[];
  //falta oficinas
  listaDoctos! : DoctocDTO[];
  listaClasificaciones!: ClasificacionDTO[];



  listCategoriasdataSource = new MatTableDataSource<FiltroVerticalGetDTO>([]);
  displayedColumns: string[] = [ 'acciones', 'categoria', 'tipo', 'norma', 'codigo', 'documento', 'version', 'oficina', 'docto', 'clasi', 'vigencia'  ];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  textoBuscar: string = "";
  estaEditando: boolean = false;
  categoriaSeleccionada!: CategoriaDTO | null;





  ngOnInit(): void {
    this.obtenerCategoriasCargarTabla();

    this.obtenerDocumentos();

    this.obtenerTipoDocumentos();
    this.obtenerCategorias();
    this.obtenerNormas();
    this.obtenerClasificaciones();
    this.obtenerDoctos();

    this.formulario.updateValueAndValidity();
  }
  
  constructor(){}

  private formbuilder = inject(FormBuilder);
  
  formulario = this.formbuilder.group({
    asunto: ['', [Validators.required]],
    codigo: ['', [Validators.required]],
    version: ['', [Validators.required]],
    normaID: ['', [Validators.required]],
    tipoDocumento: [0, [Validators.required]],
    categoriaID: [0, [Validators.required]],
    oficinaID: [0, [Validators.required]],
    doctoID: [0,  [Validators.required]],
    clasificacionID: ['',  [Validators.required]],
    palabraClave: ['', [Validators.required]]

  });



  //CRUD **********************************************************
  obtenerDocumentos(){
    this.filtroVerticalService.obtenerFiltroVertical().subscribe(response => {
      this.listaDocumentos = response;
    });
  }

  obtenerCategoriaPorId(idBuscar:number){
    //const idBuscar: number = 1;
    this.categoriasService.obtenerCategoriaPorId(idBuscar).subscribe(response => {
      console.log(response);
    });
  }

  crearCategoria(){

    console.log(this.formulario.value);

    /*
    
    if(this.formulario.invalid){
      alert("Formulario invalido");
    }else{

      const categoria = this.formulario.value as CategoriaDTO; 
      console.log(categoria);
  
      this.categoriasService.crearCategoria(categoria).subscribe(response => {
        console.log(response);
        this.obtenerCategoriasCargarTabla();
        this.formulario.reset();
        this.limpiarErroresFormulario();
        Swal.fire('Creada!', 'La categoría ha sido creada.', 'success');
      });

      
    }
    */
  
  
  }

  actualizarCategoria() {
  }

  editarCategoria(element: CategoriaDTO) {
  }

  cancelarEdicion() {
  }

  eliminarCategoria(idEliminar: number) {
  }




/********************************** Cargar listas para los catalogos *********************************************************************************************/

  obtenerTipoDocumentos(){
    this.tipodocumentoService.obtenerTipoducumentos().subscribe(response => {
      this.listaTipoDocumentos = response;
  })};

  obtenerCategorias(){
    this.categoriasService.obtenerCategorias().subscribe(response => {
      this.listaCategorias = response;
  })};

  obtenerNormas(){
    this.normasService.obtenerNormas().subscribe(response => {
      this.listaNormas = response;
  })};

  obtenerClasificaciones(){
    this.clasificacionesService.obtenerClasificaciones().subscribe(response => {
      this.listaClasificaciones = response;
  })};

  obtenerDoctos(){
    this.doctocsService.obtenerDoctocs().subscribe(response => {
      this.listaDoctos = response;
  })};

  

  // Otros ***************************************************************************************************

  obtenerCategoriasCargarTabla(){
    this.filtroVerticalService.obtenerFiltroVertical().subscribe(response => {
      this.listaDocumentos = response;
      this.setTable(this.listaDocumentos);
    });
  }

  setTable(data:FiltroVerticalGetDTO[]){
    this.listCategoriasdataSource = new MatTableDataSource<FiltroVerticalGetDTO>(data);
    this.listCategoriasdataSource.paginator = this.paginator;
  }
  
  realizarBusqueda() {
    this.filtrarData();
  }

  filtrarData(){

    /*
    const data = this.listaCategorias.slice();
    if(!this.textoBuscar){
     this.setTable(data);
      return;
    }

    const dataFiltrada = data.filter(item => {
      return item.nombre.includes(this.textoBuscar);
    })

    this.setTable(dataFiltrada);
    */
  }

  limpiarFormulario() {
    this.formulario.reset(); // Resetea los campos del formulario
    this.formulario.markAsPristine();  // Marcar como 'pristino'
    this.formulario.markAsUntouched(); // Marcar como 'intacto'
    this.formulario.updateValueAndValidity(); // Recalcular estado de validez
    this.limpiarErroresFormulario(); // Eliminar los errores
  }


 
  onSearchChange(event: any) {
    /*
    const filterValue = event.target.value?.trim().toLowerCase() || '';
    if (!filterValue) {
      // Si esta vacio, mostrar toda la lista
      this.setTable(this.listaCategorias);
      return;
    }
      */
    //pude haber hecho todo el filtro aqui, pero se requeria la necesidad del boton buscar
  }


  // validaciones *************************************************************************************

  obtenerErrorDescripcion() {
    /*
    const descripcion = this.formulario.controls.descripcion;
    if (descripcion.hasError('required')) {
      return 'El campo descripción es obligatorio';
    }
    return '';
    */
  }

  obtenerErrorNombre(){
    /*
    const nombre = this.formulario.controls.nombre;
   
    if (nombre.hasError('required')) {
      return 'El campo nombre es obligatorio';
    }

    
    if (nombre.hasError('pattern')) {
      return 'El campo nombre solo puede contener letras';
    }
    */
    return ''; 
  }

  limpiarErroresFormulario() {
    Object.keys(this.formulario.controls).forEach(key => {
      this.formulario.get(key)?.setErrors(null); // Eliminar los errores de cada control
    });
  }


}
