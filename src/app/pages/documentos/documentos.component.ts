
import { RouterLink } from '@angular/router';

import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CategoriaDTO } from '../../Core/models/CategoriaDTO';
import { ClasificacionDTO } from '../../Core/models/ClasificacionDTO';

import { TipodocumentoService } from '../../Core/services/tipodocumento.service';
import { CategoriasService } from '../../Core/services/categorias.service';
import {  NormasService  } from '../../Core/services/normas.service';
import {  EtapasService  } from '../../Core/services/etapas.service';
import {  DoctocsService  } from '../../Core/services/doctocs.service';
import { ClasificacionesService } from '../../Core/services/clasificaciones.service';
import { SubclasificacionesService } from '../../Core/services/subclasificaciones.service';
import { DocumentosService } from '../../Core/services/documentos.service';


import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl, MatPaginatorModule} from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatRadioModule} from '@angular/material/radio';

import Swal from 'sweetalert2';
import { MatSelectModule } from '@angular/material/select';
import { TipodocumentoDTO } from '../../Core/models/TipodocumentoDTO';
import { EtapaDTO } from '../../Core/models/EtapaDTO';
import { DoctocDTO } from '../../Core/models/DoctocDTO';
import { SubclasificacionDTO } from '../../Core/models/SubclasificacionDTO';
import { RelacionDocumentoDTO, RelacionDocumentoExtendidaDTO } from '../../Core/models/RelacionDocumentoDTO';
import { DocumentoDTO } from '../../Core/models/DocumentoDTO';
import { DocumentoGetById, DocumentoGetDTO, DocumentoGetExtendidaDTO } from '../../Core/models/DocumentoGetDTO';
import { CustomMatPaginatorIntlComponent } from '../../Core/components/custom-mat-paginator-intl/custom-mat-paginator-intl.component';
import { OficinasService } from '../../Core/services/oficinas.service';
import { OficinaDTO } from '../../Core/models/OficinaDTO';
import { EliminarDTO } from '../../Core/models/EliminarDTO';
import { PalabrasClaveComponent } from '../../Core/components/palabras-clave/palabras-clave.component';
import { MatTooltipModule } from '@angular/material/tooltip';


@Component({
  selector: 'app-documentos',
  standalone: true,
  imports: [RouterLink, MatButtonModule,  MatFormFieldModule, MatSelectModule, ReactiveFormsModule, MatInputModule, MatTableModule, MatPaginatorModule, MatIconModule, FormsModule, MatCheckboxModule, MatRadioModule, PalabrasClaveComponent, MatTooltipModule ],
  templateUrl: './documentos.component.html',
  styleUrl: './documentos.component.css',
  providers: [
    { provide: MatPaginatorIntl, useClass: CustomMatPaginatorIntlComponent }
  ]
})
export class DocumentosComponent implements OnInit {

  @ViewChild(PalabrasClaveComponent) palabrasClaveComponent!: PalabrasClaveComponent;
 

  tipodocumentoService = inject(TipodocumentoService);
  categoriasService = inject(CategoriasService);
  normasService = inject(NormasService);
  etapasService = inject(EtapasService);
  oficinasService = inject(OficinasService);
  doctocsService = inject(DoctocsService);
  clasificacionesService = inject(ClasificacionesService);
  subclasificacionesService = inject(SubclasificacionesService);
  documentosService = inject(DocumentosService);
  

  listaTipoDocumentos! : TipodocumentoDTO[];
  listaCategorias! : CategoriaDTO[];
  listaNormas! : CategoriaDTO[];
  listaOficinasCatalogo! : OficinaDTO[];
  listaOficinasTabla! : OficinaDTO[];
  listaEtapasPorId! : EtapaDTO[];
  listaEtapas! : EtapaDTO[];
  listaDoctos! : DoctocDTO[];
  listaClasificaciones!: ClasificacionDTO[];
  listaSubClasificacionesPorId!: SubclasificacionDTO[];
  listaSubClasificaciones!: SubclasificacionDTO[];
  listaDocumentos!: DocumentoGetDTO[];

  //lista para relacionar Documentos
  doctos: { docto: number, docRelacionado: string }[] = [];
  //lista para almacenar palabras clave
  palabrasClave: string[] = [];
  idDocumentoAEditar: number = 0;

  usuarioIDLogin: number = Number(localStorage.getItem('usuarioID'));
  oficinaIDLogin: number = Number(localStorage.getItem('oficinaSeleccionadaId'));

  //tabla Relaciones
  listaRelacionesdataSource = new MatTableDataSource<RelacionDocumentoDTO>([]);
  displayedColumnsRelaciones: string[] = [ 'acciones', 'docto', 'docrelacionado'];
  @ViewChild('paginatorRelaciones', { static: true }) paginatorRelaciones!: MatPaginator;


  //tablaDocumentos
  listaDocumentosDataSource = new MatTableDataSource<DocumentoGetExtendidaDTO>([]);
  displayedColumns: string[] = [ 'acciones', 'categoria', 'tipo', 'etapa', 'norma','codigo', 'nombre' , 'version', 'oficina', 'etiquetas',  'docto' , 'clasificacion', 'subclasificacion',  'vigencia' ];
  @ViewChild('paginatorDocumentos', { static: true }) paginatorDocumentos!: MatPaginator;

  textoBuscar: string = "";
  textoBuscarRelaciones: string = "";
  estaEditando: boolean = false;
  categoriaSeleccionada!: CategoriaDTO | null;



  ngOnInit(): void {

    this.obtenerTipoDocumentos();
    this.obtenerCategorias();
    this.obtenerNormas();
    this.obtenerOficinasParaCatalogo();
    this.obtenerOficinasParaTabla();
    this.obtenerDoctos();
    this.obtenerEtapas();
    this.obtenerSubClasificaciones();
    this.obtenerClasificaciones();

  
    // this.obtenerDocumentosCargarTabla();
    

    this.actualizarTablaRelaciones();

  }


  constructor() {}


  private formbuilder = inject(FormBuilder);
  formulario = this.formbuilder.group({
    tipoDocumento: [0, [Validators.required]],
    categoriaID: [0, [Validators.required]],
    normaID: [0, [Validators.required]],
    etapaID: [0, [Validators.required]],
    asunto: ['', [Validators.required]],
    codigo: ['', [Validators.required]],
    oficinaID: [0, [Validators.required]],
    descargable: [false],
    activo: [false],
    descripcion: ['', [Validators.required]],
    doctoID: [0],
    clasificacionID: [0],
    subClasificacionID: [0],
    vigencia: ['']
  });


  relacionDocumentoFormulario = this.formbuilder.group({
    docto: [0, Validators.required],
    docRelacionado: ['', Validators.required]
  });

 

  //CRUD ********************************************************************************************************************
  obtenerDocumentos(){
    this.documentosService.obtenerDocumentos().subscribe(response => {
      this.listaDocumentos = response;
    });
  }

  obtenerCategoriaPorId(idBuscar:number){
    //const idBuscar: number = 1;
    this.categoriasService.obtenerCategoriaPorId(idBuscar).subscribe(response => {
      console.log(response);
    });
  }


  guardarDocumento() {
    
    if (this.formulario.invalid) {
      return;
    }

    this.marcarErrores();
    
    if (this.estaEditando) {
      this.actualizarDocumento();
    } else {
      this.crearDocumento();
    }
  }



  marcarErrores() {
    // Lista de los campos requeridos
    const camposRequeridos = ['tipoDocumento', 'categoriaID', 'normaID', 'etapaID', 'asunto', 'codigo' , 'oficinaID', 'descripcion' ];
  
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
  


  
  crearDocumento() {
  
    if (this.formulario.invalid) {
      return;
    }

  
    // Mostrar ventana de confirmación antes de crear el documento
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Deseas crear este documento?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, crear documento',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        // Si el usuario confirma, procedemos a crear el documento
        const palabrasClave = this.palabrasClaveComponent.getPalabrasClave();
  
        const documento: DocumentoDTO = {
          id: 0, // Asumiendo que el ID se asigna en el backend
          codigo: this.formulario.value.codigo?.toString() || '',
          asunto: this.formulario.value.asunto?.toString() || '',
          descripcion: this.formulario.value.descripcion?.toString() || '',
          palabraClave: palabrasClave || '',   //antes era this.palabrasClave
          categoriaID: this.formulario.value.categoriaID || 0,
          tipoDocumento: this.formulario.value.tipoDocumento || 0,
          oficinaID: this.formulario.value.oficinaID || 0,
          vigencia: this.formulario.value.vigencia?.toString() || '',
          etapaID: this.formulario.value.etapaID || 0,
          subClasificacionID: this.formulario.value.subClasificacionID || 0,
          doctos: this.doctos,
          activo: this.formulario.value.activo || false,
          descargable: this.formulario.value.descargable || false,
          doctoId: this.formulario.value.doctoID || 0,
          usuarioID: this.usuarioIDLogin,
          oficinaUsuarioID: this.oficinaIDLogin,
          clasificacionID: 1,
          normaID: 1,
          versionID: 1,
          numeroVersion: 0 
        };
  
        console.log(documento);
  
        this.documentosService.crearDocumento(documento).subscribe({
          next: (response) => {
            console.log(response);
  
            if (response) {
           
              this.doctos = []; // Limpiar la lista de doctos relacionados
              this.palabrasClaveComponent.limpiarPalabrasClave();
              this.limpiarRelacionesDocumento();
              this.realizarBusqueda();
              this.limpiarFormulario();
              Swal.fire('Creado', 'El documento ha sido creado exitosamente', 'success');

            } else {
              Swal.fire('Error', 'El documento no ha sido creado exitosamente', 'error');
            }
          },
          error: (error) => {
            console.error('Error al crear el documento:', error);
            Swal.fire('Error', 'Hubo un problema al crear el documento', 'error');
          }
        });
      }
    });
  }
  

  actualizarDocumento() {
   
    if (this.formulario.invalid) {
      return; /// este no estaba eb tipo docuemento quitar si falla , esto es de hoy lunes intentando cambiar los botones
    }


    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Deseas editar este documento?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, editar documento',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {

        const palabrasClave = this.palabrasClaveComponent.getPalabrasClave();

        const documento: DocumentoDTO = {
      
        id: this.idDocumentoAEditar,
        codigo: this.formulario.value.codigo?.toString()|| '',
        asunto:this.formulario.value.asunto?.toString()|| '',
        descripcion: this.formulario.value.descripcion?.toString() || '',
        palabraClave: palabrasClave || '', 
        categoriaID: this.formulario.value.categoriaID || 0,
        tipoDocumento: this.formulario.value.tipoDocumento || 0,
        oficinaID: this.formulario.value.oficinaID || 0,
        vigencia: this.formulario.value.vigencia?.toString() || '',
        etapaID: this.formulario.value.etapaID || 0,
        subClasificacionID: this.formulario.value.subClasificacionID || 0,
        doctos: this.doctos,
    
        activo: this.formulario.value.activo || false,
        descargable: this.formulario.value.descargable || false,
        doctoId: this.formulario.value.doctoID || 0,
        usuarioID: this.usuarioIDLogin,
        oficinaUsuarioID: this.oficinaIDLogin,
        clasificacionID:1,
        normaID:1,
        versionID:1,
        numeroVersion:0
      };

      //usuarioID y oficinaUsuarioID los tomo del localStorage

      console.log(documento);
      
      this.documentosService.actualizarDocumento(documento).subscribe({
        next: (response) => {
          console.log(response);

          if(response){
          
            this.doctos = []; // Limpiar la lista de doctos relacionados
            this.actualizarTablaRelaciones();
            this.palabrasClaveComponent.limpiarPalabrasClave();
            this.realizarBusqueda();
            this.limpiarFormulario();
            Swal.fire('Editado', 'El documento ha sido editado exitosamente', 'success');

          }else{
            Swal.fire('Error', 'El documento no ha sido editado exitosamente', 'error');
          }
        
        },
        error: (error) => {
          console.error('Error al crear el documento:', error);
          Swal.fire('Error', 'Hubo un problema al editar el documento', 'error');
        }
      });

    }
    });
    

  }

  editarDocumento(idDocumento: number) {

    console.log(idDocumento);

    this.estaEditando = true;
    this.idDocumentoAEditar = idDocumento;
    let documentoAEditar : DocumentoGetById;

    this.documentosService.obtenerDocumentoPorIdParaEditar(idDocumento).subscribe(response => {

      if(response){

        documentoAEditar = response;
        
        // Cargar los datos de la categoría en el formulario
        this.formulario.patchValue({
          tipoDocumento: documentoAEditar.tipoDocumento ,
          categoriaID: documentoAEditar.categoriaID ,
          normaID: documentoAEditar.normaID,
          etapaID: documentoAEditar.etapaID ,
          asunto: documentoAEditar.asunto ,
          codigo: documentoAEditar.codigo ,
          oficinaID: documentoAEditar.oficinaID ,
          descargable: documentoAEditar.descargable ,
          activo: documentoAEditar.activo ,
          descripcion: documentoAEditar.descripcion ,
          doctoID: documentoAEditar.doctoId ,
          clasificacionID: documentoAEditar.clasificacionID ,
          subClasificacionID: documentoAEditar.subClasificacionID ,
          vigencia: documentoAEditar.vigencia
        });



        //cargo los catalogos que dependen de estos seguan su eleccion
        this.onNormaChange(documentoAEditar.normaID);
        this.onClasificacionChange(documentoAEditar.clasificacionID);

        //carga tabla relaciones documentos
        this.limpiarRelacionesDocumento();
        this.doctos = documentoAEditar.doctos;
        

        //cargar lista de palabras clave
        this.palabrasClaveComponent.limpiarPalabrasClave();
        this.palabrasClaveComponent.setearPalabrasClave(documentoAEditar.palabraClave);
         
        console.log(documentoAEditar);

      }else{
        console.log("Error al obtener los datos para la edicion");
      }
    
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
    
    const camposRequeridos: string[] = ['tipoDocumento', 'categoriaID','normaID', 'etapaID','asunto', 'codigo','oficinaID', 'descargable','activo', 'descripcion','doctoID', 'clasificacionID', 'subClasificacionID', 'vigencia'];
    camposRequeridos.forEach(campo => {
      const control = this.formulario.get(campo);
      if (control) {
        // Verificar si el campo es booleano y asignar false en lugar de un valor vacío
        if (campo === 'descargable' || campo === 'activo') {
          control.setValue(false);
        } else {
          control.setValue('');
        }
      }
    });

    this.palabrasClaveComponent.limpiarPalabrasClave();
    this.limpiarRelacionesDocumento();

  
   //limpiar los errores del formulario
   Object.keys(this.formulario.controls).forEach(key => {
    this.formulario.get(key)?.setErrors(null); // Eliminar los errores de cada control
   });

   this.formulario.updateValueAndValidity();

    // Reseteamos los estados del componente
    this.estaEditando = false;
    this.categoriaSeleccionada = null;

  }




  eliminarDocumento(idEliminar: number) {
    // Mostrar el SweetAlert para confirmar la eliminación
    Swal.fire({
        title: '¿Desea eliminar el documento?',
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
            this.documentosService.eliminarDocumento(eliminarDTO).subscribe(response => {
                console.log(response);
                if(response){
                  this.realizarBusqueda();
                  this.limpiarFormulario();
                  Swal.fire('Eliminado!', 'El documento ha sido eliminado.', 'success');
                }else{
                  Swal.fire('Error!', 'El documento no ha sido eliminado.', 'error');
                }
               
               
            });
        }
    });
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

  obtenerOficinasParaCatalogo(){
    this.oficinasService.obtenerOficinasParaCatalogo().subscribe(response => {
      this.listaOficinasCatalogo = response;
  })};

  obtenerOficinasParaTabla(){
    this.oficinasService.obtenerOficinas().subscribe(response => {
      this.listaOficinasTabla = response;
  })};

  onNormaChange(normaId: number) {
    this.obtenerEtapasPorId(normaId);
  };

  obtenerEtapasPorId(normaId: number) {
    this.etapasService.obtenerEtapas().subscribe(response => {
      this.listaEtapasPorId = response.filter(etapa => etapa.normaID === normaId);
    });
  };

  obtenerEtapas(){
    this.etapasService.obtenerEtapas().subscribe(response => {
      this.listaEtapas = response;
  })};
  
  obtenerDoctos(){
    this.doctocsService.obtenerDoctocs().subscribe(response => {
      this.listaDoctos = response;
  })};
  
  obtenerClasificaciones(){
    this.clasificacionesService.obtenerClasificaciones().subscribe(response => {
      this.listaClasificaciones = response;
  })};

  onClasificacionChange(clasificacionId: number) {
    this.obtenerSubClasificacionesPorId(clasificacionId);
  };

  obtenerSubClasificacionesPorId(clasificacionId: number) {
    this.subclasificacionesService.obtenerSubclasificaciones().subscribe(response => {
      this.listaSubClasificacionesPorId = response.filter(subclasificacion => subclasificacion.clasificacionID === clasificacionId);
    });
  };

  obtenerSubClasificaciones(){
    this.subclasificacionesService.obtenerSubclasificaciones().subscribe(response => {
      this.listaSubClasificaciones = response;
  })};
  
  




  /******************   Agregar relaciones documentos ****************************************************************************************************/
 
  agregarRelacionDocumento() {
    if (this.relacionDocumentoFormulario.valid) {
      const docto = this.relacionDocumentoFormulario.get('docto')?.value;
      const docRelacionado = this.relacionDocumentoFormulario.get('docRelacionado')?.value;

      this.doctos.push({
        docto: docto!,
        docRelacionado: docRelacionado!
      });


      Swal.fire('Creada!', 'La relacion ha sido creada.', 'success');

      // Optionally, update your data source for the relations table
      this.actualizarTablaRelaciones();

      // Reset the form after adding
      this.relacionDocumentoFormulario.reset();

      console.log(this.doctos);
    }
  }

  actualizarTablaRelaciones() {

    //this.listaRelacionesdataSource.data = this.doctos;

    setTimeout(() => {
    
      const dataConRelaciones: RelacionDocumentoExtendidaDTO[] = this.doctos.map(docRelaciones => {
        
        const docto = this.listaDoctos.find(doctoc => doctoc.id === docRelaciones.docto);
  
        return {
          ...docRelaciones,
          nombreDocto: docto ? docto.nombre : 'Sin Docto'
        };
      });

      //console.log(dataConRelaciones);
  
      this.listaRelacionesdataSource.data = dataConRelaciones;

     
    }, 1000);


  }

  eliminarRelacionDocumento(id: number) {
    // Buscar el índice del documento a eliminar usando el id
    const index = this.doctos.findIndex(docto => docto.docto === id);
    
    if (index !== -1) {
      // Eliminar el documento de la lista
      this.doctos.splice(index, 1);
  
      // Actualizar la tabla con la lista modificada
      this.actualizarTablaRelaciones();
  
      Swal.fire('Eliminada!', 'La relación ha sido eliminada.', 'success');
  
      console.log(this.doctos);
    } else {
      Swal.fire('Error', 'No se encontró la relación a eliminar.', 'error');
    }
  }

  limpiarRelacionesDocumento() {
    this.doctos = [];
    this.actualizarTablaRelaciones();
  }
  

   
  

  // Otros ***********************************************************************************

  obtenerDocumentosCargarTabla(){
    this.documentosService.obtenerDocumentos().subscribe(response => {
      this.listaDocumentos = response;
      this.setTable(this.listaDocumentos);
      //console.log(this.listaDocumentos);
    });
  }

  setTable(data: DocumentoGetDTO[]) {

      // Simulamos una espera con setTimeout para alguna carga visual si es necesario
      setTimeout(() => {
    
        // Mapear los datos para agregar nombres de relaciones (categoría, tipo de documento, etc.)
        const dataConRelaciones: DocumentoGetExtendidaDTO[] = data.map(documento => {
          const categoria = this.listaCategorias.find(cat => cat.id === documento.categoriaID);
          const tipoDocumento = this.listaTipoDocumentos.find(tipo => tipo.id === documento.tipoDocumento);
          const etapa = this.listaEtapas.find(etp => etp.id === documento.etapaID);
          const norma = this.listaNormas.find(nrm => nrm.id === documento.normaID);
          const oficina = this.listaOficinasTabla.find(ofi => ofi.id === documento.oficinaID);
          const clasificacion = this.listaClasificaciones.find(clas => clas.id === documento.clasificacionID);
          const subClasificacion = this.listaSubClasificaciones.find(sub => sub.id === documento.subClasificacionID);
          const docto = this.listaDoctos.find(doctoc => doctoc.id === documento.doctoId);
    
          return {
            ...documento,
            categoriaNombre: categoria ? categoria.nombre : 'Sin Categoría',
            tipoDocumentoNombre: tipoDocumento ? tipoDocumento.nombre : 'Sin Tipo',
            etapaNombre: etapa ? etapa.nombre : 'Sin Etapa',
            normaNombre: norma ? norma.nombre : 'Sin Norma',
            oficinaNombre: oficina ? oficina.nombre : 'Sin oficina',
            clasificacionNombre: clasificacion ? clasificacion.nombre : 'Sin Clasificación',
            subClasificacionNombre: subClasificacion ? subClasificacion.nombre : 'Sin Subclasificación',
            doctoNombre: docto ? docto.nombre : 'Sin Docto' // Suponiendo que `nombre` está en DocumentoGetDTO
          };
        });

       // console.log(dataConRelaciones);
    
        // Configuramos el DataSource con los datos mapeados
        this.listaDocumentosDataSource = new MatTableDataSource<DocumentoGetExtendidaDTO>(dataConRelaciones);
        this.listaDocumentosDataSource.paginator = this.paginatorDocumentos;

       
      }, 1000); // Ajusta este delay si no es necesario

      
  }

  limpiarTabla(){
    this.listaDocumentos = [];
    this.setTable([]);
  }
  
  
  realizarBusqueda() {
    this.limpiarTabla();
    this.obtenerDocumentos();
    this.filtrarData();
  }

  filtrarData() {
   

    setTimeout(() => {

      const data = this.listaDocumentos.slice();
      const dataFiltrada = data.filter(item => {
        // Verifica si el texto de búsqueda está en el asunto o en el código del item
        return (
          item.asunto?.toLowerCase().includes(this.textoBuscar.toLowerCase()) ||
          item.codigo?.toLowerCase().includes(this.textoBuscar.toLowerCase())
        );
      });
  
      this.setTable(dataFiltrada);
    }, 1500); 
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





  // validaciones ********************************************************************************************************************


  obtenerErrorDocSG() {
    const tipoDocumento = this.formulario.controls.tipoDocumento;
    if (tipoDocumento.hasError('required')) {
      return 'El campo tipo documento es obligatorio';
    }
      
    return '';
  }

  obtenerErrorCategoria() {
    const tipoDocumento = this.formulario.controls.categoriaID;
    if (tipoDocumento.hasError('required')) {
      return 'El campo categoría es obligatorio';
    }
   
    return '';
  }


  obtenerErrorNorma() {
    const tipoDocumento = this.formulario.controls.normaID;
    if (tipoDocumento.hasError('required')) {
      return 'El campo norma es obligatorio';
    }
   
    return '';
  }

  obtenerErrorEtapa() {
    const tipoDocumento = this.formulario.controls.etapaID;
    if (tipoDocumento.hasError('required')) {
      return 'El campo etapa es obligatorio';
    }
   
    return '';
  }

  
  obtenerErrorAsunto() {
    const tipoDocumento = this.formulario.controls.asunto;
    if (tipoDocumento.hasError('required')) {
      return 'El campo asunto es obligatorio';
    }
   
    return '';
  }


  obtenerErrorCodigo() {
    const tipoDocumento = this.formulario.controls.codigo;
    if (tipoDocumento.hasError('required')) {
      return 'El campo código es obligatorio';
    }
   
    return '';
  }

  obtenerErrorOficina() {
    const tipoDocumento = this.formulario.controls.oficinaID;
    if (tipoDocumento.hasError('required')) {
      return 'El campo oficina es obligatorio';
    }
   
    return '';
  }


  noRequerido(){
    return '';
  }

 
}
