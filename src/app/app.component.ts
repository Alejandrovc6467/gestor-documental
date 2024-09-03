import { DatePipe, NgOptimizedImage } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {  RouterOutlet } from '@angular/router';
import { ListadoPeliculasComponent } from './peliculas/listado-peliculas/listado-peliculas.component';

import { MatIcon, MatIconModule } from '@angular/material/icon';
import { SidebarComponent } from "./compartidos/componentes/sidebar/sidebar.component";
import { LogueoComponent } from './logueo/logueo.component';

@Component({
  selector: 'app-root', //nombre de la etiquta del componente
  standalone: true, // activa el standalone para ya no usar los NgModule y hacer las importaciones directamente aqui, es lo nuevo que se usa
  imports: [ListadoPeliculasComponent, RouterOutlet, MatIcon, SidebarComponent, MatIconModule, SidebarComponent, LogueoComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  

}
