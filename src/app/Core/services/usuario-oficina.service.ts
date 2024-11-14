import { inject, Injectable } from '@angular/core';
import { UsuarioExtendidaDTO } from '../models/UsuarioDTO';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UsuarioOficinaDTO } from '../models/UsuarioOficinaDTO';

@Injectable({
  providedIn: 'root'
})
export class UsuarioOficinaService {


  private http = inject(HttpClient);
  private urlBase = "http://gestordocumental.somee.com/api/UsuarioOficina";// esto se haria mas profesional creando un enviroment, que son ambiemtes de desarrolo uno para pruebas y otro para produccion


  constructor() { }


  public obtenerUsuarioOficinas(): Observable<UsuarioOficinaDTO[]>{
    return this.http.get<UsuarioOficinaDTO[]> (this.urlBase);
  }

  

}
