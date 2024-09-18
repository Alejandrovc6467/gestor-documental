import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-listado-peliculas',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './listado-peliculas.component.html',
  styleUrl: './listado-peliculas.component.css'
})
export class ListadoPeliculasComponent {

  
  @Input({required: true})//hago que el array de abajo sea obligatorio parasarlo como parametro en el html de este componente
  listaPeliculas!: any []; // el ! es para indicar que no importa que la variable se encuentre vacia, el any es para indicar que va a ser un arreglo de cualquier tipo no importa



  title = 'gestor-documental'; 

  miVariable = 'Ya tu sabe';

  fecha = new Date();

  duplicarNumero (valor: number) : number{
    return valor * 2;
  }
}
