import {  Input, numberAttribute } from '@angular/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CategoriaDTO } from '../../Core/models/CategoriaDTO';
import { VersionDTO } from '../../Core/models/VersionDTO';
import { CategoriasService } from '../../Core/services/categorias.service';
import { DocumentosService } from '../../Core/services/documentos.service';
import { VersionesService } from '../../Core/services/versiones.service';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl, MatPaginatorModule} from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { DocumentoGetDTO } from '../../Core/models/DocumentoGetDTO';
import { DatePipe } from '@angular/common';
import { CustomMatPaginatorIntlComponent } from '../../Core/components/custom-mat-paginator-intl/custom-mat-paginator-intl.component';
import { FiltroVerticalGetExtendidaDTO } from '../../Core/models/FiltroVerticalGetDTO';
import { PdfViewerComponent } from 'ng2-pdf-viewer';
import { MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';



@Component({
  selector: 'app-documentoversiones',
  standalone: true,
  imports: [MatButtonModule,  MatFormFieldModule, ReactiveFormsModule, MatInputModule, MatTableModule, MatPaginatorModule, MatIconModule, FormsModule, MatDatepickerModule, MatNativeDateModule,  MatCheckboxModule, MatRadioModule, MatTooltipModule ],
  templateUrl: './documentoversiones.component.html',
  styleUrl: './documentoversiones.component.css',
  providers: [
    { provide: MatPaginatorIntl, useClass: CustomMatPaginatorIntlComponent },
     DatePipe
  ]
})
export class DocumentoversionesComponent implements OnInit  {

  @Input({transform: numberAttribute})
  id!: number;

  private dialog = inject(MatDialog); // Usa inject en lugar del constructor



  categoriasService = inject(CategoriasService);
  documentosService = inject(DocumentosService);
  versionesService = inject(VersionesService);

  listaCategorias! : VersionDTO[];
  listCategoriasdataSource = new MatTableDataSource<VersionDTO>([]);
  displayedColumns: string[] = [ 'acciones', 'version', 'nombreArchivo', 'fechaVersion', 'obsoleto'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  textoBuscar: string = "";
  estaEditando: boolean = false;
  categoriaSeleccionada!: VersionDTO | null;

  objetoDocumentoParaCargarDatosQuemados!: DocumentoGetDTO | null;


  ngOnInit(): void {
    this.obtenerVersionesCargarTabla();
    this.formulario.updateValueAndValidity();
    this.cargarCamposQuemadosEnHtml();
  }
  
  constructor(private datePipe: DatePipe) { } // Inyectar DatePipe

  private formbuilder = inject(FormBuilder);
  formulario = this.formbuilder.group({
    nombreDocumento: ['', [Validators.required]],
    nombreUsuario: ['', [Validators.required]],
    oficina: ['', [Validators.required]],
    version: ['', [Validators.required]],
    numeroSCD: ['', [Validators.required]],
    justificacion: ['', [Validators.required]],
    FechaCreacion: ['', [Validators.required]],
    docDinamico: [false],
    obsoleto: [false],
    archivo: [null as File | null, [Validators.required]]
  });

 
  onFileSelected(event: Event): void {
    const element = event.currentTarget as HTMLInputElement;
    let file: File | null = element.files ? element.files[0] : null;
    
    if (file) {
      this.formulario.patchValue({
        archivo: file
      }, { emitEvent: false });  // Para evitar que el cambio cause eventos innecesarios
    }
  }
  

  //llamar este  en el onInit()
  cargarCamposQuemadosEnHtml(){

    setTimeout(() => {
      this.documentosService.obtenerDocumentoPorId(this.id).subscribe(response => {
       
        this.objetoDocumentoParaCargarDatosQuemados = response;

        this.formulario.patchValue({
          nombreDocumento: this.objetoDocumentoParaCargarDatosQuemados?.asunto,
          nombreUsuario: 'Juan Pérez',
          oficina: 'Oficina Central'
        });

        //console.log(this.objetoDocumentoParaCargarDatosQuemados);

      });

    }, 2000);
    
    
 
      //luego creo una VersionDTO y lo seteo con los datos del formulario y los de objetoDocumentoParaCargarDatosQuemados 
      //esto ultimo en el metodo guardar obvio
  
    
  }



  //CRUD ************************************************************************************************
  obtenerCategorias(){
    /*
    this.versionesService.obtenerCategorias().subscribe(response => {
      this.listaCategorias = response;
    });
    */
  }

  obtenerCategoriaPorId(idBuscar:number){
    //const idBuscar: number = 1;
    this.categoriasService.obtenerCategoriaPorId(idBuscar).subscribe(response => {
      console.log(response);
    });
  }

  crearVersion(){
    
    console.log("Entre al crear version");
    


    /*Reuerde sacar el id del usuario del storage y el id de oficina del storage tambien
    el campo oficinaid falta en el swagger */
   
    if (this.formulario.invalid) {
      console.log("El formulario es inválido");
      return;
    }

    setTimeout(() => {
  
    const fechaCreacion = this.formulario.value.FechaCreacion;
    if (fechaCreacion) {
      const fechaFormateada = this.datePipe.transform(fechaCreacion, 'dd/MM/yyyy');
      this.formulario.patchValue({ FechaCreacion: fechaFormateada });
    }
  
 

    const versionData: VersionDTO = {
      documentoID: this.id,
      numeroVersion: Number(this.formulario.value.version) || 0,
      fechaCreacion: this.formulario.value.FechaCreacion || '',
      eliminado: false,
      usuarioID: 1,
      docDinamico: Boolean(this.formulario.get('docDinamico')?.value),
      obsoleto: Boolean(this.formulario.get('obsoleto')?.value),
      numeroSCD: this.formulario.get('numeroSCD')?.value || '',
      justificacion: this.formulario.value.justificacion || '',
      archivo: this.formulario.value.archivo || null,
      UsuarioLogID: 1,
      OficinaID: 1
    };

  
    //antes lo haia asi
    //const version = this.formulario.value as VersionDTO; 
 
    console.log(versionData);
  
    this.versionesService.crearVersion(versionData).subscribe(response => {

      console.log(response);
      if(response){
        this.obtenerVersionesCargarTabla();
        this.formulario.reset();
        this.limpiarErroresFormulario();
        Swal.fire('Creada!', 'La versión ha sido creada.', 'success');
      }else{
        Swal.fire('Error!', 'La versión no ha sido creada.', 'error');
      }
      
    });

  }, 3000);

  
  }

  actualizarCategoria() {
    /*
    if (!this.categoriaSeleccionada) return;
      const categoriaActualizada: CategoriaDTO = {
        id: this.categoriaSeleccionada.id,
        nombre: this.formulario.value.nombre!,
        descripcion: this.formulario.value.descripcion!
      };
      this.categoriasService.actualizarCategoria(categoriaActualizada).subscribe(response => {
        console.log(response);
        this.obtenerVersionesCargarTabla();
        this.cancelarEdicion();
        this.limpiarErroresFormulario();
        Swal.fire('Editada!', 'La categoría ha sido editada.', 'success');
      });
      */
  }

  editarCategoria(element: CategoriaDTO) {
    /*
    // Método para cargar los datos de la categoría seleccionada y activar el modo de edición
    this.estaEditando = true;
    this.categoriaSeleccionada = element;
    // Cargar los datos de la categoría en el formulario
    this.formulario.patchValue({
      nombre: element.nombre,
      descripcion: element.descripcion
    });
    this.limpiarErroresFormulario();
    */
  }

  cancelarEdicion() {
    this.estaEditando = false;
    this.categoriaSeleccionada = null;
    this.formulario.reset(); // Limpiar el formulario
    this.formulario.markAsPristine();  // Marcar como 'pristino'
    this.formulario.markAsUntouched(); // Marcar como 'intacto'
    this.formulario.updateValueAndValidity(); // Recalcular estado de validez
  }

  eliminarVersion(idEliminar: number) {
    // Mostrar el SweetAlert para confirmar la eliminación

    
    Swal.fire({
        title: '¿Desea eliminar la versión?',
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
            this.versionesService.eliminarVersion(idEliminar).subscribe(response => {
                console.log(response);
                this.obtenerVersionesCargarTabla();
                Swal.fire('Eliminada!', 'La versión ha sido eliminada.', 'success');
            });
        }
    });
    
  }


  

  // Otros *******************************************************************************************

  // en le html voy a pasar element.urlArchivo  y aqui tengo que quitar ese if deporsi ya se que siempre es un pdf por la validacione en el front
  // ademas agregar el nuevo atributo en VersionDTO
  observarDocumento(element: FiltroVerticalGetExtendidaDTO) {
    if (element.archivo.contentType === 'application/pdf') {
      console.log(element.urlArchivo);
      const dialogRef = this.dialog.open(PdfViewerComponent, {
        data: { url: element.urlArchivo },
        panelClass: ['pdf-viewer-dialog', 'fullscreen-dialog'],
        maxWidth: '100vw',
        maxHeight: '100vh',
        height: '100vh',
        width: '100vw',
      });
    }
  }


  obtenerVersionesCargarTabla(){
    this.versionesService.obtenerVersionesPorId(this.id).subscribe(response => {
      this.listaCategorias = response;
      console.log(this.listaCategorias);
      this.setTable(this.listaCategorias);
    });
  }

  setTable(data:VersionDTO[]){
    this.listCategoriasdataSource = new MatTableDataSource<VersionDTO>(data);
    this.listCategoriasdataSource.paginator = this.paginator;
    console.log(this.listaCategorias);
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
    const filterValue = event.target.value?.trim().toLowerCase() || '';
    if (!filterValue) {
      // Si esta vacio, mostrar toda la lista
      this.setTable(this.listaCategorias);
      return;
    }
    //pude haber hecho todo el filtro aqui, pero se requeria la necesidad del boton buscar
  }


 


  
  // validaciones *******************************************************************************************************************
  obtenerErrorJustificacion() {
    const justificacion = this.formulario.controls.justificacion;
    if (justificacion.hasError('required')) {
      return 'El campo justificacion es obligatorio';
    }
    return '';
  }

  obtenerErrorNombre(){
    const nombre = this.formulario.controls.nombreDocumento;
   
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

  obtenerErrorFecha() {
    const fecha = this.formulario.controls.FechaCreacion;
    if (fecha.hasError('required')) {
      return 'La fecha es obligatoria';
    }
    return '';
  }

  obtenerErrorDocumento() {
    const documento = this.formulario.controls.archivo;
    if (documento.hasError('required')) {
      return 'El documento es obligatorio';
    }
    return '';
  }

  obtenerErrorArchivo() {
    const control = this.formulario.get('archivo');
    if (control?.hasError('required')) {
      return 'El archivo es requerido';
    }
    return '';
  }

}
