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

@Component({
  selector: 'app-iniciosesionprincipal',
  standalone: true,
  imports: [MatButtonModule,  MatFormFieldModule, ReactiveFormsModule, MatInputModule, MatTableModule, MatPaginatorModule, MatIconModule, FormsModule],
  templateUrl: './iniciosesionprincipal.component.html',
  styleUrl: './iniciosesionprincipal.component.css'
})
export class IniciosesionprincipalComponent {
  seguridadService = inject(SeguridadService);
  router = inject(Router);


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
  
    /*
    this.seguridadService.loggin2(this.formulario.value.user!, this.formulario.value.password!).subscribe({
      next: () => this.inicioSesionCorrecto() ,
      error: (err) => {
        console.log("Credenciales incorrectas", err);
        this.errorLoggin();
      },
    });
    */

    this.seguridadService.loggin(this.formulario.value.user!, this.formulario.value.password!)
    .subscribe(
      response => {
        if (response) {
          console.log(response);
          // Aquí puedes llamar a una función para manejar el inicio de sesión correcto
          // this.inicioSesionCorrecto();
        } else {
          this.errorLoggin();
        }
      },
      error => {
        // Aquí manejamos el error
        if (error.status === 400) {
          console.error('Error 400: Solicitud incorrecta');
          alert('Error: Los datos proporcionados no son correctos.');
          // Aquí puedes llamar a una función que muestre el error de inicio de sesión
          this.errorLoggin();
        } else {
          console.error('Error en la solicitud:', error);
          alert('Ocurrió un error inesperado en el inicio de sesión.');
        }
      }
    );
  
    
      
    
  }


  inicioSesionCorrecto(): void{


    /*
    Admistrador General 1 {todo}

    Administrador Norma 2 {Todos los cruds y Consultas y documentos, no puede meter categorias ni normas}  
    Administrador Digesto 3 {Todos los cruds y Consultas y documentos, no puede meter categorias ni normas}  

    Usuario General 4 {Solo reportes y consultas, todo lo demas lo quito}

    */


    //aqui depende de si las oficinas son 2 o mas lo paso al loggin de oficinas o sino lo paso directo al app
    // y si lo paso directo setear la oficina seleccionada     localStorage.setItem('oficinaSeleccionadaId', this.formulario.value.oficinaId!);
    this.router.navigate(['consultas/filtroHorizontal'])
  }



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
