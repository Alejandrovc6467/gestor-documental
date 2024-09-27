import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EjemploDTO } from '../models/EjemploDTO';

@Injectable({
  providedIn: 'root'
})
export class EjemploService {

  private http = inject(HttpClient);
  private urlBase = "http://localhost:5121/api/Ejemplo";// esto se haria mas profesional creando un enviroment, que son ambiemtes de desarrolo uno para pruebas y otro para produccion


  constructor() { }

  public obtenerEjemplos(): Observable<EjemploDTO[]>{
    return this.http.get<EjemploDTO[]> (this.urlBase);
  }
  public crearEjemplo(ejemplo: EjemploDTO){
    return this.http.post(this.urlBase, ejemplo);
  }

  public obtenerEjemploPorId(id:number): Observable<EjemploDTO>{
    return this.http.get<EjemploDTO>(`${this.urlBase}/${id}`);
  }

}
