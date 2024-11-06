import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NormaDTO } from '../models/NormaDTO';

@Injectable({
  providedIn: 'root'
})
export class ReportesService {

  private http = inject(HttpClient);
  private urlBitacoraMovimientos = "http://gestordocumental.somee.com/api/Norma";// esto se haria mas profesional creando un enviroment, que son ambiemtes de desarrolo uno para pruebas y otro para produccion
  private urlControlVersiones = "http://gestordocumental.somee.com/api/Norma";
  private urlDocumentosAntiguos = "http://gestordocumental.somee.com/api/Norma";
  private urlMaestroDocumentos = "http://gestordocumental.somee.com/api/Norma";
  private urlMaestroDocumentosNorma = "http://gestordocumental.somee.com/api/Norma";
  private urlDescargaDocumentos = "http://gestordocumental.somee.com/api/Norma";
  private urlDocumentosSINMovimiento = "http://gestordocumental.somee.com/api/Norma";
  
  
  //hacer una url distinta para cada obtener Reportes
  

  constructor() { }


  public obtenerNormas(): Observable<NormaDTO[]>{
    return this.http.get<NormaDTO[]> (this.urlBitacoraMovimientos);
  }

  public obtenerNormasPorId(id:number): Observable<NormaDTO>{
    return this.http.get<NormaDTO>(`${this.urlBitacoraMovimientos}/${id}`);
  }
  public crearNorma(norma: NormaDTO){
    return this.http.post(this.urlBitacoraMovimientos, norma);
  }

  public actualizarNorma(norma: NormaDTO){
    return this.http.put(this.urlBitacoraMovimientos, norma);
  }

  public eliminarNorma(id:number){
    return this.http.delete(`${this.urlBitacoraMovimientos}/${id}`);
  }

}
