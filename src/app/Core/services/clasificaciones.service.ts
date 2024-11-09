import { inject, Injectable } from '@angular/core';
import { ClasificacionDTO } from '../models/ClasificacionDTO';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EliminarDTO } from '../models/EliminarDTO';

@Injectable({
  providedIn: 'root'
})
export class ClasificacionesService {


  private http = inject(HttpClient);
  private urlBase = "http://gestordocumental.somee.com/api/Clasificacion";// esto se haria mas profesional creando un enviroment, que son ambiemtes de desarrolo uno para pruebas y otro para produccion


  constructor() { }


  public obtenerClasificaciones(): Observable<ClasificacionDTO[]>{
    return this.http.get<ClasificacionDTO[]> (this.urlBase);
  }

  public obtenerClasificacionPorId(id:number): Observable<ClasificacionDTO>{
    return this.http.get<ClasificacionDTO>(`${this.urlBase}/${id}`);
  }
  public crearClasificacion(clasificacion: ClasificacionDTO){
    return this.http.post(this.urlBase, clasificacion);
  }

  public actualizarClasificacion(clasificacion: ClasificacionDTO){
    return this.http.put(this.urlBase, clasificacion);
  }



  public eliminarClasificacion(eliminarDTO: EliminarDTO): Observable<any> {
    return this.http.delete(this.urlBase, { body: eliminarDTO });
  }
}
