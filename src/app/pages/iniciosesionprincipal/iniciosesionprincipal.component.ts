import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import Swal from 'sweetalert2';
import { SeguridadService } from '../../Core/services/seguridad.service';
import { Router } from '@angular/router';
import { OficinasService } from '../../Core/services/oficinas.service';
import { OficinaDTO } from '../../Core/models/OficinaDTO';
import { UsuarioOficinaService } from '../../Core/services/usuario-oficina.service';
import { UsuarioOficinaDTO } from '../../Core/models/UsuarioOficinaDTO';


@Component({
  selector: 'app-iniciosesionprincipal',
  standalone: true,
  imports: [MatButtonModule,  MatFormFieldModule, ReactiveFormsModule, MatInputModule, MatTableModule, MatPaginatorModule, MatIconModule, FormsModule],
  templateUrl: './iniciosesionprincipal.component.html',
  styleUrl: './iniciosesionprincipal.component.css'
})
export class IniciosesionprincipalComponent {

  seguridadService = inject(SeguridadService);
  oficinasService = inject(OficinasService);
  usuarioOficinaService = inject(UsuarioOficinaService);
  router = inject(Router);

  listaOficinasTabla! : OficinaDTO[];

  listaUsuarioOficinas! : UsuarioOficinaDTO[];


  private formbuilder = inject(FormBuilder);
  formulario = this.formbuilder.group({
    user: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });



  loggin(): void {

    if (this.formulario.invalid) {
      this.mostrarErrores();
      return;
    }

    this.seguridadService.loggin(this.formulario.value.user!, this.formulario.value.password!)
    .subscribe(
      response => {

        console.log(response);
        this.inicioSesionCorrecto(response.id);
       
      },
      error => {
        // Aquí manejamos el error
        if (error.status === 404) {
          console.log("error");
          this.errorLoggin();
        } else {
          alert('Ocurrió un error inesperado en el inicio de sesión.');
        }
      }
    );
  
    
      
    
  }


  /*
    Admistrador General 1 {todo}

    Administrador Norma 2 {Todos los cruds y Consultas y documentos, no puede meter categorias ni normas}  
    Administrador Digesto 3 {Todos los cruds y Consultas y documentos, no puede meter categorias ni normas}  

    Usuario General 4 {Solo reportes y consultas, todo lo demas lo quito}
  */


    inicioSesionCorrecto(id: number): void {
      this.usuarioOficinaService.obtenerUsuarioOficinas().subscribe(response => {
        this.listaUsuarioOficinas = response;
    
        // Filtrar las oficinas que corresponden al usuarioID
        const oficinasUsuario = this.listaUsuarioOficinas.filter(item => item.usuarioID === id);
    
        // Verificar si el usuario está en más de una oficina
        const conteoId = oficinasUsuario.length;
    
        if (conteoId > 1) {
          // Guardar en localStorage los id de las oficinas en las que está el usuario
          const oficinaIds = oficinasUsuario.map(item => item.oficinaID); // Extraer los id de las oficinas
          localStorage.setItem('usuarioOficinas', JSON.stringify(oficinaIds)); // Guardar en localStorage
    
          // Redirigir al usuario a la página de selección de oficinas
          this.router.navigate(['iniciosesionoficinas']);
        } else {
        
          // Si solo hay una oficina, guardar ese id en el localStorage
          localStorage.setItem('oficinaSeleccionadaId', oficinasUsuario[0].oficinaID.toString());
          // Redirigir al usuario a la página de consultas
          this.router.navigate(['consultas/filtroHorizontal']);
        }
      });
    }
    


  obtenerOficinasParaTabla(){
    this.oficinasService.obtenerOficinas().subscribe(response => {
      this.listaOficinasTabla = response;
  })};



  mostrarErrores(): void{

    // Obtener elemento del DOM
    const mensajeDiv = document.querySelector('.mensaje') as HTMLElement;
      
    // Construir mensaje de error
    let mensajeError = '';
    
    if (this.formulario.controls.user.errors) {
      if (this.formulario.controls.user.errors['required']) {
        mensajeError += 'El usuario es requerido<br>';
      }
      if (this.formulario.controls.user.errors['email']) {
        mensajeError += 'El formato del email es inválido<br>';
      }
    }
    
    if (this.formulario.controls.password.errors?.['required']) {
      mensajeError += 'La contraseña es requerida<br>';
    }
    
    // Mostrar mensaje
    if (mensajeDiv) {
      mensajeDiv.innerHTML = mensajeError;
      mensajeDiv.style.color = 'rgb(89, 94, 110)';

    }
    
    return;
  }

  errorLoggin():void {
    console.error('Error al iniciar');
    const mensajeDiv = document.querySelector('.mensaje') as HTMLElement;
    if (mensajeDiv) {
      mensajeDiv.innerHTML = 'Credenciales incorrectas.';
      mensajeDiv.style.color = 'rgb(89, 94, 110)';   
    }
  }


}
