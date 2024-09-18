import { DatePipe, NgOptimizedImage } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {  RouterOutlet } from '@angular/router';

import { MatIcon, MatIconModule } from '@angular/material/icon';
import { LogueoComponent } from './logueo/logueo.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';

@Component({
  selector: 'app-root', //nombre de la etiquta del componente
  standalone: true, // activa el standalone para ya no usar los NgModule y hacer las importaciones directamente aqui, es lo nuevo que se usa
  imports: [ RouterOutlet, MatIcon, SidebarComponent,  MatIconModule, LogueoComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  

}
