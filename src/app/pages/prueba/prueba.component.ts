import { Component, OnInit } from '@angular/core';
import { ListadoPeliculasComponent } from '../../shared/listado-peliculas/listado-peliculas.component';

@Component({
  selector: 'app-prueba',
  standalone: true,
  imports: [ListadoPeliculasComponent],
  templateUrl: './prueba.component.html',
  styleUrl: './prueba.component.css'
})
export class PruebaComponent implements OnInit {
  ngOnInit(): void {
   
    // Yo puse a implementar OnInit a AppComponet, el OnInit se usa para implementar funcionabilidades apenas carga el componente, este metodo se ejecuta apenas se cargue el componente
   //basicamente es una funcion que se ejcuta por si sola al iniciar el componente y el resto de funciones de la clase son para logica futura como una funcion para un formulario
   //aqui se podria hacer la consulta al service(que se conecta al api) y mientras responde pues pongo el spinner


   //voy simular una espera con este setTime
   setTimeout(() => {

     this.listaPeliculasEncine = [{
       titulo: 'Inside Out 2',
       fechaLanzamiento: new Date(),
       precio: 1400.99,
       poster: 'https://upload.wikimedia.org/wikipedia/en/f/f7/Inside_Out_2_poster.jpg?20240514232832'
     },
     {
       titulo: 'Moana 2',
       fechaLanzamiento: new Date('2016-05-03'),
       precio: 300.99,
       poster: 'https://upload.wikimedia.org/wikipedia/en/7/73/Moana_2_poster.jpg'
     }];


     this.listaPeliculasExtrenos = [
     {
       titulo: 'Bad Boys: Ride or Die',
       fechaLanzamiento: new Date('2016-05-03'),
       precio: 300.99,
       poster: 'https://upload.wikimedia.org/wikipedia/en/8/8b/Bad_Boys_Ride_or_Die_%282024%29_poster.jpg'
     },
     {
       titulo: 'Deadpool & Wolverine',
       fechaLanzamiento: new Date('2016-05-03'),
       precio: 300.99,
       poster: 'https://upload.wikimedia.org/wikipedia/en/thumb/4/4c/Deadpool_%26_Wolverine_poster.jpg/220px-Deadpool_%26_Wolverine_poster.jpg'
     },
     {
       titulo: 'Oppenheimer',
       fechaLanzamiento: new Date('2016-05-03'),
       precio: 300.99,
       poster: 'https://upload.wikimedia.org/wikipedia/en/thumb/4/4a/Oppenheimer_%28film%29.jpg/220px-Oppenheimer_%28film%29.jpg'
     },
     {
       titulo: 'The Flash',
       fechaLanzamiento: new Date('2016-05-03'),
       precio: 300.99,
       poster: 'https://upload.wikimedia.org/wikipedia/en/thumb/e/ed/The_Flash_%28film%29_poster.jpg/220px-The_Flash_%28film%29_poster.jpg'
     }];
     
   }, 2000);

 }


 listaPeliculasEncine!: any [];
 listaPeliculasExtrenos!: any [];

}
