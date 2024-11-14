import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NormaDTO } from '../../Core/models/NormaDTO';
import { NormasService } from '../../Core/services/normas.service';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { OficinasService } from '../../Core/services/oficinas.service';
import { OficinaDTO } from '../../Core/models/OficinaDTO';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-iniciosesionoficinas',
  standalone: true,
  imports: [CommonModule,MatButtonModule,  MatFormFieldModule, MatSelectModule,ReactiveFormsModule, MatInputModule, MatTableModule, MatPaginatorModule, MatIconModule, FormsModule],
  templateUrl: './iniciosesionoficinas.component.html',
  styleUrls: ['./iniciosesionoficinas.component.css'] // Cambiado a styleUrls
})
export class IniciosesionoficinasComponent implements OnInit {

  router = inject(Router);
  oficinasService = inject(OficinasService);
  listaOficinas!: OficinaDTO[];

  oficinasCargadas = false; // Indicador de carga de oficinas

  ngOnInit(): void {
    this.cargarUsuario();
    this.obtenerOficinas();
    this.setOficinasEnLocalStorage();
    this.cargarOficinas();
  }

  private formbuilder = inject(FormBuilder);
  formulario = this.formbuilder.group({
    user: ['', [Validators.required]],
    oficinaId: [null, [Validators.required]]
  });

  obtenerOficinas() {
    this.oficinasService.obtenerOficinas().subscribe(response => {
      this.listaOficinas = response;
      console.log(this.listaOficinas);
    });
  } 



  cargarUsuario() {
    this.formulario.patchValue({
      user: localStorage.getItem('correo')
    });
 
  }

  cargarOficinas() {
    setTimeout(() => {

       // Obtener los IDs de las oficinas almacenados en localStorage
      const oficinasIdsGuardadas = JSON.parse(localStorage.getItem('usuarioOficinas') || '[]');

      // Filtrar las oficinas que coinciden con los IDs almacenados
      this.listaOficinas = this.listaOficinas.filter(oficina => 
        oficinasIdsGuardadas.includes(oficina.id)
      );

      this.oficinasCargadas = true; // Actualizamos el indicador una vez que las oficinas están filtradas
    }, 1500);

  }


  // lo simulo esto ya debio ser seteado en el service al momento de hacer el loggin
  setOficinasEnLocalStorage() {
    const oficinasEjemplo = [
      { oficinaID: 1 },
      { oficinaID: 3 },
      { oficinaID: 5 }
    ];
    localStorage.setItem('oficinas', JSON.stringify(oficinasEjemplo));
  }


  loggin(): void {

    console.log('Presiono');
    if (this.formulario.invalid) {
      this.mostrarErrores();
      return;
    }

    localStorage.setItem('oficinaSeleccionadaId', this.formulario.value.oficinaId!);
    this.router.navigate(['/usuarios']);
  }


  
  mostrarErrores(): void {
    console.log('entro a mostrar');
    const mensajeDiv = document.querySelector('.mensaje') as HTMLElement;
    let mensajeError = '';
    
    if (this.formulario.controls.oficinaId.errors?.['required']) {
      mensajeError += 'La oficina es requerida<br>';
    }
    
    if (mensajeDiv) {
      mensajeDiv.innerHTML = mensajeError;
      mensajeDiv.style.color = 'rgb(89, 94, 110)';
    }
  }
  

}
