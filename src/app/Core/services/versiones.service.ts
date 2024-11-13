import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { VersionDTO } from '../models/VersionDTO';
import { EliminarDTO } from '../models/EliminarDTO';

@Injectable({
  providedIn: 'root'
})
export class VersionesService {

  private http = inject(HttpClient);
  private urlBase = "http://gestordocumental.somee.com/api/Version";// esto se haria mas profesional creando un enviroment, que son ambiemtes de desarrolo uno para pruebas y otro para produccion

  constructor() { }

 
  public obtenerVersionesPorId(id:number): Observable<VersionDTO[]>{
    return this.http.get<VersionDTO[]>(`${this.urlBase}/buscarDocumentoPorID/${id}`);
  }
    

  public crearVersion(version: VersionDTO): Observable<any> {

    const formData = new FormData();
    
    if (version.archivo) {
      formData.append('archivo', version.archivo, version.archivo.name);
    }

    let params = new HttpParams()
      .set('DocumentoID', version.documentoID.toString())
      .set('NumeroVersion', version.numeroVersion.toString())
      .set('FechaCreacion', version.fechaCreacion)
      .set('eliminado', version.eliminado.toString())
      .set('usuarioID', version.usuarioID.toString())
      .set('DocDinamico', version.docDinamico.toString())
      .set('Obsoleto', version.obsoleto.toString())
      .set('NumeroSCD', version.numeroSCD)
      .set('justificacion', version.justificacion)
      .set('UsuarioLogID', version.UsuarioLogID)
      .set('OficinaID', version.OficinaID);

    return this.http.post(this.urlBase, formData, { params: params });
  }


  public actualizarVersion(version: VersionDTO): Observable<any> {

    const formData = new FormData();
    
    if (version.archivo) {
        formData.append('archivo', version.archivo, version.archivo.name);
    }

    // Creamos los parámetros, verificando si 'id' está definido
    let params = new HttpParams();

    if (version.id !== undefined) {
        params = params.set('Id', version.id.toString());
    }

    params = params
      .set('DocumentoID', version.documentoID.toString())
      .set('NumeroVersion', version.numeroVersion.toString())
      .set('FechaCreacion', version.fechaCreacion)
      .set('eliminado', version.eliminado.toString())
      .set('usuarioID', version.usuarioID.toString())
      .set('DocDinamico', version.docDinamico.toString())
      .set('Obsoleto', version.obsoleto.toString())
      .set('NumeroSCD', version.numeroSCD)
      .set('justificacion', version.justificacion)
      .set('UsuarioLogID', version.UsuarioLogID.toString())
      .set('OficinaID', version.OficinaID.toString());

    if (version.urlVersion) {
        params = params.set('urlVersion', version.urlVersion);
    }

    return this.http.put(this.urlBase, formData, { params: params });
  }


  

  public eliminarVersion(eliminarDTO: EliminarDTO): Observable<any> {
    return this.http.delete(this.urlBase, { body: eliminarDTO });
  }

  
  public obtenerVersionPorId(id:number): Observable<VersionDTO>{
    return this.http.get<VersionDTO>(`${this.urlBase}/${id}`);
  }
    

}