import { inject, Injectable } from '@angular/core';
import { UsuarioDTO } from '../models/UsuarioDTO';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  private http = inject(HttpClient);
  private urlBase = "http://gestordocumental.somee.com/api/Usuario";// esto se haria mas profesional creando un enviroment, que son ambiemtes de desarrolo uno para pruebas y otro para produccion

  private urlObtenerUsuariosPorOficinaID = "http://gestordocumental.somee.com/api/Usuario/ObtenerUsuariosPorOficinaID";// esto se haria mas profesional creando un enviroment, que son ambiemtes de desarrolo uno para pruebas y otro para produccion


  constructor() { }


  public obtenerUsuarios(): Observable<UsuarioDTO[]>{
    return this.http.get<UsuarioDTO[]> (this.urlBase);
  }

  public obtenerUsuarioPorId(id:number): Observable<UsuarioDTO>{
    return this.http.get<UsuarioDTO>(`${this.urlBase}/${id}`);
  }
  public crearUsuario(categoria: UsuarioDTO){
    return this.http.post(this.urlBase, categoria);
  }

  public actualizarUsuario(categoria: UsuarioDTO){
    return this.http.put(this.urlBase, categoria);
  }

  public eliminarUsuario(id:number){
    return this.http.delete(`${this.urlBase}/${id}`);
  }



  public obtenerUsuariosPorOficina(id:number): Observable<UsuarioDTO[]>{
    return this.http.get<UsuarioDTO[]>(`${this.urlObtenerUsuariosPorOficinaID}/${id}`);
  }

}
