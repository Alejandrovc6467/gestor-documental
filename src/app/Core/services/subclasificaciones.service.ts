import { inject, Injectable } from '@angular/core';
import { SubclasificacionDTO } from '../models/SubclasificacionDTO';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EliminarDTO } from '../models/EliminarDTO';

@Injectable({
  providedIn: 'root'
})
export class SubclasificacionesService {

  private http = inject(HttpClient);
  private urlBase = "http://gestordocumental.somee.com/api/Subclasificacion";// esto se haria mas profesional creando un enviroment, que son ambiemtes de desarrolo uno para pruebas y otro para produccion


  constructor() { }


  public obtenerSubclasificaciones(): Observable<SubclasificacionDTO[]>{
    return this.http.get<SubclasificacionDTO[]> (this.urlBase);
  }

  public obtenerSubclasificacionPorId(id:number): Observable<SubclasificacionDTO>{
    return this.http.get<SubclasificacionDTO>(`${this.urlBase}/${id}`);
  }
  public crearSubclasificacion(subclasificacion: SubclasificacionDTO){
    return this.http.post(this.urlBase, subclasificacion);
  }

  public actualizarSubclasificacion(subclasificacion: SubclasificacionDTO){
    return this.http.put(this.urlBase, subclasificacion);
  }


  public eliminarSubclasificacion(eliminarDTO: EliminarDTO): Observable<any> {
    return this.http.delete(this.urlBase, { body: eliminarDTO });
  }

}
