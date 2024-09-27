import { Component, OnInit } from '@angular/core';
import { ListadoPeliculasComponent } from '../../Core/components/listado-peliculas/listado-peliculas.component';

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


/*

*************** Apuntes mios

RECUERDE el let y const

// Definición de tipos de variables

  // Variable de tipo string
  nombre: string = 'Angular';

  // Variable de tipo number
  version: number = 18;

  // Variable de tipo boolean
  esActivo: boolean = true;

  // Variable de tipo array de números
  numeros: number[] = [1, 2, 3, 4, 5];

  // Variable de tipo array de strings
  nombres: string[] = ['Ana', 'Carlos', 'Pedro'];

  // Variable de tipo objeto con una estructura definida
  usuario: { nombre: string, edad: number, esActivo: boolean } = {
    nombre: 'Juan',
    edad: 30,
    esActivo: true
  };

  // Variable de tipo any (puede almacenar cualquier tipo)
  cualquierValor: any = 'Texto o número';

  // Variable de tipo null o string (tipo opcional)
  mensaje: string | null = null;

  // Función con parámetros tipados y un valor de retorno tipado
  saludar(nombre: string): string {
    return `Hola, ${nombre}!`;
  }



  ******** Ejemplo de ! y ?

  class Usuario {
   nombre?: string;  // El nombre es opcional
  }

  const usuario = new Usuario();

  // Usamos ? para acceder de forma segura
  console.log(usuario.nombre?.toUpperCase());  // Si nombre es undefined, no falla

  // Usamos ! para asegurar que el valor no es null ni undefined
  usuario.nombre = 'Juan';
  console.log(usuario.nombre!.toUpperCase());  // Aquí garantizamos que no es null






*/
