import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-palabras-clave',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="palabras-clave-wrapper">
      <mat-form-field appearance="outline" class="palabras-clave-field">
        <mat-label>Palabras clave (Ingresa una palabra y presiona 'Enter' para agregar)</mat-label>
        <input matInput
               #inputPalabra
               [formControl]="palabraControl"
               (keydown.enter)="$event.preventDefault()"
               (keyup.enter)="agregarPalabraClave(inputPalabra)">
      </mat-form-field>
  

      <div class="palabras-container">
        @for (palabra of palabrasClave; track $index) {
          <div class="palabra-chip">
            <span>{{ palabra }}</span>
            <button type="button"  class="eliminar-button" (click)="eliminarPalabraHandler($event, $index)">X</button>
          </div>
        }
      </div>
    </div>

    <style>
      :host {
        display: block;
        width: 100%;
      }

      .palabras-clave-wrapper {
        width: 100%;
        display: flex;
        align-items: center;
        flex-direction: column;
      }

      .palabras-clave-field {
        width: 100%;
        max-width: 1000px;
        padding: 0px 11px;
      }

      ::ng-deep .palabras-clave-field .mat-mdc-form-field-infix {
        width: 100% !important;
      }

      .palabras-container {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-top: 8px;
        width: 100%;
        max-width: 1000px;
        padding: 0px 11px;
        margin-bottom: 30px;
      }
      
      .palabra-chip {
        
        background-color: #dee7f6 ;
        position: relative;
        padding: 5px 15px;
        display: flex;
        align-items: center;
        font-size: 15px;
        font-weight: 600;
        text-decoration: none;
        border-radius: 25px;
        outline: none;
        overflow: hidden;
        color: rgba(88, 101, 242, 1);
        color: #005cbb;
        transition: color 0.3s 0.1s ease-out;
        text-align: center;

      
      }
      
      .eliminar-button {
        width: 20px;
        height: 20px;
        color: white;
        padding-right: 0px;
        line-height: 20px;
        margin-left: 7px;
        background-color: #005cbb;
        border: none;
        border-radius: 50%;
        cursor: pointer;
      }
      
      .mat-icon {
        font-size: 18px;
        width: 18px;
        height: 18px;
        line-height: 18px;
      }
    </style>
  `
})
export class PalabrasClaveComponent {
  palabrasClave: string[] = [];
  palabraControl = new FormControl('');

  agregarPalabraClave(inputElement: HTMLInputElement) {
    const palabra = inputElement.value.trim();
    if (palabra) {
      this.palabrasClave = [...this.palabrasClave, palabra];
      inputElement.value = '';
      this.palabraControl.reset();
    }
  }

  eliminarPalabraHandler(event: Event, index: number) {
    event.preventDefault();
    event.stopPropagation();
    this.eliminarPalabra(index);
  }

  eliminarPalabra(index: number) {
    this.palabrasClave = this.palabrasClave.filter((_, i) => i !== index);
  }

  getPalabrasClave(): string[] {
    return this.palabrasClave;
  }
}