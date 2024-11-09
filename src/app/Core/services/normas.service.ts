import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NormaDTO } from '../models/NormaDTO';
import { EliminarDTO } from '../models/EliminarDTO';

@Injectable({
  providedIn: 'root'
})
export class NormasService {


  private http = inject(HttpClient);
  private urlBase = "http://gestordocumental.somee.com/api/Norma";// esto se haria mas profesional creando un enviroment, que son ambiemtes de desarrolo uno para pruebas y otro para produccion


  constructor() { }


  public obtenerNormas(): Observable<NormaDTO[]>{
    return this.http.get<NormaDTO[]> (this.urlBase);
  }

  public obtenerNormasPorId(id:number): Observable<NormaDTO>{
    return this.http.get<NormaDTO>(`${this.urlBase}/${id}`);
  }
  public crearNorma(norma: NormaDTO){
    return this.http.post(this.urlBase, norma);
  }

  public actualizarNorma(norma: NormaDTO){
    return this.http.put(this.urlBase, norma);
  }

 

  public eliminarNorma(eliminarDTO: EliminarDTO): Observable<any> {
    return this.http.delete(this.urlBase, { body: eliminarDTO });
  }

}
