import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NormaDTO } from './normaDTO';


@Component({
  selector: 'app-normas',
  standalone: true,
  imports: [MatButtonModule,  MatFormFieldModule, ReactiveFormsModule, MatInputModule],
  templateUrl: './normas.component.html',
  styleUrl: './normas.component.css'
})
export class NormasComponent {


  private formbuilder = inject(FormBuilder);

  formulario = this.formbuilder.group({
    nombre: ['', Validators.required],
    descripcion: ['', Validators.required]
  })

  guardarCambios(){
    alert(this.formulario.value.descripcion);

    if(!this.formulario.valid){
      alert("Formulario invalido");
    }

    const norma = this.formulario.value as NormaDTO; // asi es como se deben de utilizar los DTO
    //puedeo cambiar algun dato como el tipo de fecha antes de enviarlo a un service, y pues obvio ya no tengo que crear el objecto json, solo paso el DTO que es lo mismo
    console.log(norma);
  }

  //validaciones
  obtenerErrorCamposRequeridos() {

    const nombre = this.formulario.controls.nombre;
    const descripcion = this.formulario.controls.descripcion;
  
    if (nombre.hasError('required')) {
      return 'El campo nombre es obligatorio';
    }

    //hacer un metodo para cada input
  
    if (descripcion.hasError('required')) {
      return 'El campo descripción es obligatorio';
    }


    return ''; // Retorna vacío si no hay errores
  }
  


}

