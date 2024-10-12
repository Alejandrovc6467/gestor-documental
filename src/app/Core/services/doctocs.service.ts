import { inject, Injectable } from '@angular/core';
import { DoctocDTO } from '../models/DoctocDTO';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DoctocsService {


  private http = inject(HttpClient);
  private urlBase = "http://gestordocumental.somee.com/api/Categoria";// esto se haria mas profesional creando un enviroment, que son ambiemtes de desarrolo uno para pruebas y otro para produccion


  constructor() { }


  public obtenerDoctocs(): Observable<DoctocDTO[]>{
    return this.http.get<DoctocDTO[]> (this.urlBase);
  }

  public obtenerDoctocPorId(id:number): Observable<DoctocDTO>{
    return this.http.get<DoctocDTO>(`${this.urlBase}/${id}`);
  }
  public crearDoctoc(doctoc: DoctocDTO){
    return this.http.post(this.urlBase, doctoc);
  }

  public actualizarDoctoc(doctoc: DoctocDTO){
    return this.http.put(this.urlBase, doctoc);
  }

  public eliminarDoctoc(id:number){
    return this.http.delete(`${this.urlBase}/${id}`);
  }

}
