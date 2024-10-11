import { inject, Injectable } from '@angular/core';
import { TipodocumentoDTO } from '../models/TipodocumentoDTO';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TipodocumentoService {


  private http = inject(HttpClient);
  private urlBase = "http://gestordocumental.somee.com/api/TipoDocumento";// esto se haria mas profesional creando un enviroment, que son ambiemtes de desarrolo uno para pruebas y otro para produccion


  constructor() { }


  public obtenerTipoducumentos(): Observable<TipodocumentoDTO[]>{
    return this.http.get<TipodocumentoDTO[]> (this.urlBase);
  }

  public obtenerTipodocumentoPorId(id:number): Observable<TipodocumentoDTO>{
    return this.http.get<TipodocumentoDTO>(`${this.urlBase}/${id}`);
  }
  public crearTipodocumento(tipodocumento: TipodocumentoDTO){
    return this.http.post(this.urlBase, tipodocumento);
  }

  public actualizarTipodocumento(tipodocumento: TipodocumentoDTO){
    return this.http.put(this.urlBase, tipodocumento);
  }

  public eliminarTipodocumento(id:number){
    return this.http.delete(`${this.urlBase}/${id}`);
  }



}
