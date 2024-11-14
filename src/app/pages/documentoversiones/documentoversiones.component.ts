import {  Input, numberAttribute } from '@angular/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { VersionDTO } from '../../Core/models/VersionDTO';
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
import { PdfViewerComponent } from '../../Core/components/pdf-viewer/pdf-viewer.component';
import { MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { firstValueFrom } from 'rxjs';
import { FiltroVerticalService } from '../../Core/services/filtro-vertical.service';
import { RouterLink } from '@angular/router';
import { EliminarDTO } from '../../Core/models/EliminarDTO';
import { MovimientoDTO } from '../../Core/models/MovimientoDTO';
import { MovimientoService } from '../../Core/services/movimiento.service';


@Component({
  selector: 'app-documentoversiones',
  standalone: true,
  imports: [MatButtonModule, RouterLink,  MatFormFieldModule, ReactiveFormsModule, MatInputModule, MatTableModule, MatPaginatorModule, MatIconModule, FormsModule, MatDatepickerModule, MatNativeDateModule,  MatCheckboxModule, MatRadioModule, MatTooltipModule ],
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

  documentosService = inject(DocumentosService);
  versionesService = inject(VersionesService);
  movimientoService = inject(MovimientoService);

  listaCategorias! : VersionDTO[];
  listCategoriasdataSource = new MatTableDataSource<VersionDTO>([]);
  displayedColumns: string[] = [ 'acciones', 'version', 'nombreArchivo', 'fechaVersion', 'obsoleto'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  textoBuscar: string = "";
  estaEditando: boolean = false;
  versionAEditar!: VersionDTO | null;
  objetoDocumentoParaCargarDatosQuemados!: DocumentoGetDTO | null;
  filtroVerticalService = inject(FiltroVerticalService);


  ngOnInit(): void {
    //this.obtenerVersionesCargarTabla();
    this.cargarCamposQuemadosEnHtml();
    this.setTable([]);
    this.obtenerVersiones();
  }
  
  constructor(private datePipe: DatePipe) { } // Inyectar DatePipe

  private formbuilder = inject(FormBuilder);
  formulario = this.formbuilder.group({
    nombreDocumento: ['', [Validators.required]],
    nombreUsuario: ['', [Validators.required]],
    oficina: ['', [Validators.required]],
    version: [null as number | null, [Validators.required, Validators.pattern('^[0-9]+$')]],
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

    }, 500);
    
    //luego creo una VersionDTO y lo seteo con los datos del formulario y los de objetoDocumentoParaCargarDatosQuemados 
    //esto ultimo en el metodo guardar obvio
  
  }



  //CRUD ************************************************************************************************



  obtenerVersiones(){
    this.versionesService.obtenerVersionesPorId(this.id).subscribe(response => {
      this.listaCategorias = response;
    });
  }

  guardarVersion() {
    
    if (this.formulario.invalid) {

      console.log('invalido en guardarVersion');
    
      this.formulario.markAllAsTouched();

      // Verificar si todos los campos, excepto "archivo", están llenos, estopara mostrar la venta de archivo vacio solo para este caso
      const camposLlenos = Object.keys(this.formulario.controls).every(campo => {
        if (campo !== 'archivo') {
          return this.formulario.get(campo)?.value !== '';
        }
        return true;
      });

      // Verificar si el campo "archivo" está vacío
      const archivoControl = this.formulario.get('archivo');
      if (camposLlenos && archivoControl?.value === null) {
        Swal.fire('Espera!', 'Selecciona un archivo.', 'error');
      }

      return;

    }


    this.marcarErrores();
    
    if (this.estaEditando) {
      this.actualizarVersion();
    } else {
      this.crearVersion();
    }
  }



  marcarErrores() {
    // Lista de los campos requeridos
    const camposRequeridos = [ 'nombreDocumento', 'nombreUsuario', 'oficina', 'version', 'numeroSCD', 'justificacion', 'FechaCreacion', 'archivo'];
  
    camposRequeridos.forEach(campo => {
      const control = this.formulario.get(campo);
  
      // Marca el campo como tocado
      control?.markAsTouched();
  
      // Si el campo está vacío, establece el error de 'required'
      if (campo === 'archivo' && !control?.value) {
        control?.setErrors({ required: true });
      } else if (campo !== 'archivo' && !control?.value) {
        control?.setErrors({ required: true, pattern: true });
      }
    });
  }

  crearVersion(){

   
    if (this.formulario.invalid) {
      console.log('invalido');
      return;
    }


    
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Deseas crear esta versión?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, crear',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {

        setTimeout(() => {
  
          const fechaCreacion = this.formulario.value.FechaCreacion;
          if (fechaCreacion) {
            const fechaFormateada = this.datePipe.transform(fechaCreacion, 'dd/MM/yyyy');
            this.formulario.patchValue({ FechaCreacion: fechaFormateada });
          }
        
      
    
          const versionData: VersionDTO = {
            documentoID: this.id,
            numeroVersion: this.formulario.value.version || 0,
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
    
    
          console.log(versionData);
        
          this.versionesService.crearVersion(versionData).subscribe(response => {
    
            console.log(response);
            if(response){
              // //
              this.limpiarFormulario();
              Swal.fire('Creada!', 'La versión ha sido creada.', 'success');
            }else{
              Swal.fire('Error!', 'La versión no ha sido creada.', 'error');
            }
            
          });
    
        }, 3000);
    

      }
    });
    
   
    
  
  }

  actualizarVersion() {

    if (this.formulario.invalid) {
      return;
    }

    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Deseas actualizar la versión?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, actualizar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {


        const versionData: VersionDTO = {
          id: this.versionAEditar?.id,
          documentoID: this.id,
          numeroVersion: this.formulario.value.version || 0,
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
    
        
        this.versionesService.actualizarVersion(versionData).subscribe(response => {
            console.log(response);
            if(response){
            
              // //
              this.limpiarFormulario();
              Swal.fire('Editada!', 'La versión ha sido editada.', 'success');

            }else{
              Swal.fire('Error!', 'La versión no ha sido editada.', 'error');
            }

        });
        

      }
    });

      
  }

 





  async editarVersion(idVersion: number) {
    console.log(idVersion);
    this.estaEditando = true;

    try {
        const response = await firstValueFrom(this.versionesService.obtenerVersionPorId(idVersion));
        
        if (response) {
            this.versionAEditar = response;
            console.log(this.versionAEditar);

            // Convertimos la fecha
            const fechaCreacion = new Date(this.versionAEditar.fechaCreacion);
            const fechaFormateada = fechaCreacion.toISOString().split('T')[0];

            // Obtener el archivo
            if (this.versionAEditar?.urlVersion) {
              // Descargar el archivo usando el servicio
              const blob = await firstValueFrom(this.filtroVerticalService.descargarArchivo(this.versionAEditar.urlVersion));
                
                
              // Obtener el nombre del archivo de manera segura
              const fileName = (this.versionAEditar.archivo as any)?.fileName || 'documento.pdf';


              // Crear un objeto File a partir del Blob
              const file = new File([blob as Blob], fileName, {
                    type: 'application/pdf'
                });
                

                // Actualizar el formulario con todos los datos
                this.formulario.patchValue({
                    nombreDocumento: this.objetoDocumentoParaCargarDatosQuemados?.asunto,
                    nombreUsuario: 'Juan Pérez',
                    oficina: 'Oficina Central',
                    version: this.versionAEditar.numeroVersion,
                    numeroSCD: this.versionAEditar.numeroSCD,
                    justificacion: this.versionAEditar.justificacion,
                    FechaCreacion: fechaFormateada,
                    docDinamico: this.versionAEditar.docDinamico,
                    obsoleto: this.versionAEditar.obsoleto,
                    archivo: file
                });
            }
        } else {
            console.log("Error al obtener los datos para la edicion");
        }
    } catch (error) {
        console.error('Error al editar la versión:', error);
        Swal.fire('Error', 'No se pudieron cargar los datos para la edición', 'error');
    }

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
    
    const camposRequeridos: string[] = ['version', 'numeroSCD','justificacion', 'FechaCreacion','docDinamico', 'codigo','obsoleto', 'archivo'];
    camposRequeridos.forEach(campo => {
      const control = this.formulario.get(campo);
      if (control) {
        // Verificar si el campo es booleano y asignar false en lugar de un valor vacío
        if (campo === 'docDinamico' || campo === 'obsoleto') {
          control.setValue(false);
        } else if (campo === 'version') {
          control.setValue('');
        } else if (campo === 'archivo') {
          control.setValue(null); // Establecer el campo de archivo a null
        } else {
          control.setValue('');
        }
      }
    });
  

   //limpiar los errores del formulario
   Object.keys(this.formulario.controls).forEach(key => {
    this.formulario.get(key)?.setErrors(null); // Eliminar los errores de cada control
   });

   this.cargarCamposQuemadosEnHtml();

   this.formulario.updateValueAndValidity();

    // Reseteamos los estados del componente
    this.estaEditando = false;

  }




  eliminarVersion(idEliminar: number) {

    console.log(idEliminar);
   
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


          const eliminarDTO:  EliminarDTO = {
            objetoID: idEliminar,
            usuarioID: 1,// esto sale del local
            oficinaID: 1// y este
          };

            // Si el usuario confirma, proceder con la eliminación
            this.versionesService.eliminarVersion(eliminarDTO).subscribe(response => {
                console.log(response);
                if(response){
                  // //
                  this.limpiarFormulario();
                  Swal.fire('Eliminada!', 'La versión ha sido eliminada.', 'success');
                }else{
                  Swal.fire('Error!', 'La versión no ha sido eliminada.', 'error');
                }
              
            });
        }
    });
    
  }


  

  // Otros *******************************************************************************************

  observarDocumento(element: any) {
    //if (element.archivo.contentType === 'application/pdf') {
      console.log(element.urlVersion);
      const dialogRef = this.dialog.open(PdfViewerComponent, {
        data: { url: element.urlVersion },
        panelClass: ['pdf-viewer-dialog', 'fullscreen-dialog'],
        maxWidth: '100vw',
        maxHeight: '100vh',
        height: '100vh',
        width: '100vw',
      });

      const movimiento:  MovimientoDTO = {
        idMovimiento: 0,
        versionID: element.id,
        fechaIngreso: new Date().toISOString(),
        usuarioID: 1,
        movimiento: false
      };
  
      this.movimientoService.RegistrarMovimiento(movimiento).subscribe(response => {
        console.log(response);
      });
    
   // }
  }


  obtenerVersionesCargarTabla(){
    this.versionesService.obtenerVersionesPorId(this.id).subscribe(response => {
      this.listaCategorias = response;
      this.setTable(this.listaCategorias);
    });
  }

  setTable(data:VersionDTO[]){
    this.listCategoriasdataSource = new MatTableDataSource<VersionDTO>(data);
    this.listCategoriasdataSource.paginator = this.paginator;
  }
  
  
  realizarBusqueda() {
    this.filtrarData();
  }

  filtrarData() {
    const data = this.listaCategorias.slice();
    setTimeout(() => {
      const dataFiltrada = data.filter(item => {
        // Extrae el nombre del archivo del urlVersion
        const nombreArchivo = item.urlVersion?.split('\\').pop();
        
        // Convierte numeroVersion a string para compararlo con textoBuscar
        const numeroVersionStr = item.numeroVersion.toString();
  
        // Aplica el filtro basado en nombre del archivo, numeroVersion o fechaCreacion
        return nombreArchivo?.toLowerCase().includes(this.textoBuscar.toLowerCase()) ||
               numeroVersionStr.includes(this.textoBuscar) ||
               item.fechaCreacion.includes(this.textoBuscar);
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


 


  
  // validaciones *******************************************************************************************************************

  obtenerErrorVersion() {
    const version = this.formulario.controls.version;
    if (version.hasError('required')) {
      return 'La versión es obligatoria';
    } else if (version.hasError('pattern')) {
      return 'La versión debe ser un número';
    }
    return '';
  }

  obtenerErrorNoSCD() {
    const justificacion = this.formulario.controls.numeroSCD;
    if (justificacion.hasError('required')) {
      return 'El campo No.SCD es obligatorio';
    }
    return '';
  }


  obtenerErrorJustificacion() {
    const justificacion = this.formulario.controls.justificacion;
    if (justificacion.hasError('required')) {
      return 'El campo justificacion es obligatorio';
    }
    return '';
  }

  obtenerErrorFecha() {
    const fecha = this.formulario.controls.FechaCreacion;
    if (fecha.hasError('required')) {
      return 'La fecha es obligatoria';
    }
    return '';
  }

  

  obtenerErrorArchivo() {
    const archivo = this.formulario.get('archivo');
    if (archivo?.hasError('required')) {
      return 'El archivo es obligatorio';
    }
    return '';
  }

  obtenerErrorNombre(){

  }

}
