import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { VersionDTO } from '../models/VersionDTO';

@Injectable({
  providedIn: 'root'
})
export class VersionesService {

  private http = inject(HttpClient);
  private urlBase = "http://gestordocumental.somee.com/api/Version";// esto se haria mas profesional creando un enviroment, que son ambiemtes de desarrolo uno para pruebas y otro para produccion


  constructor() { }


  /*
  public obtenerCategorias(): Observable<VersionDTO[]>{
    return this.http.get<VersionDTO[]> (this.urlBase);
  }
  */


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
      .set('justificacion', version.justificacion);

    return this.http.post(this.urlBase, formData, { params: params });
  }

  /*
  public actualizarCategoria(categoria: CategoriaDTO){
    return this.http.put(this.urlBase, categoria);
  }
  */
  public eliminarVersion(id:number){
    return this.http.delete(`${this.urlBase}/${id}`);
  }
    
    

}