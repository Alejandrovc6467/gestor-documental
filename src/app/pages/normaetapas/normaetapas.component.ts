import { Component, Input, numberAttribute } from '@angular/core';

@Component({
  selector: 'app-normaetapas',
  standalone: true,
  imports: [],
  templateUrl: './normaetapas.component.html',
  styleUrl: './normaetapas.component.css'
})
export class NormaetapasComponent {

  @Input({transform: numberAttribute})
  id!: number;

}
