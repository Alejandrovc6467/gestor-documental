import { inject, Injectable } from '@angular/core';
import { OficinaDTO } from '../models/OficinaDTO';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class OficinasService {

  private http = inject(HttpClient);
  private urlBase = "http://gestordocumental.somee.com/api/Oficina";// esto se haria mas profesional creando un enviroment, que son ambiemtes de desarrolo uno para pruebas y otro para produccion


  constructor() { }


  public obtenerOficinas(): Observable<OficinaDTO[]>{
    return this.http.get<OficinaDTO[]> (this.urlBase);
  }

  public obtenerOficinaPorId(id:number): Observable<OficinaDTO>{
    return this.http.get<OficinaDTO>(`${this.urlBase}/${id}`);
  }
  public crearOficina(oficina: OficinaDTO){
    return this.http.post(this.urlBase, oficina);
  }

  public actualizarOficina(oficina: OficinaDTO){
    return this.http.put(this.urlBase, oficina);
  }

  public eliminarOficina(id:number){
    return this.http.delete(`${this.urlBase}/${id}`);
  }

}
