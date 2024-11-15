import { Component, OnInit } from '@angular/core';
import {  RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-root', //nombre de la etiquta del componente
  standalone: true, // activa el standalone para ya no usar los NgModule y hacer las importaciones directamente aqui, es lo nuevo que se usa
  imports: [ RouterOutlet ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  

}
