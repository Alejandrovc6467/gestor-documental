import { Component, Input, numberAttribute } from '@angular/core';

@Component({
  selector: 'app-documentoversiones',
  standalone: true,
  imports: [],
  templateUrl: './documentoversiones.component.html',
  styleUrl: './documentoversiones.component.css'
})
export class DocumentoversionesComponent {

  @Input({transform: numberAttribute})
  id!: number;

}
