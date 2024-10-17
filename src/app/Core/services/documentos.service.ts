import { inject, Injectable } from '@angular/core';
import { CategoriaDTO } from '../models/CategoriaDTO';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DocumentoDTO } from '../models/DocumentoDTO';
import { DocumentoGetDTO } from '../models/DocumentoGetDTO';

@Injectable({
  providedIn: 'root'
})
export class DocumentosService {

  private http = inject(HttpClient);
  private urlBase = "http://gestordocumental.somee.com/api/Documento";// esto se haria mas profesional creando un enviroment, que son ambiemtes de desarrolo uno para pruebas y otro para produccion


  constructor() { }


  public obtenerDocumentos(): Observable<DocumentoGetDTO[]>{
    return this.http.get<DocumentoGetDTO[]> (this.urlBase);
  }

  /*
  public obtenerCategoriaPorId(id:number): Observable<CategoriaDTO>{
    return this.http.get<CategoriaDTO>(`${this.urlBase}/${id}`);
  }
  */

  public crearDocumento(documento: DocumentoDTO){
    return this.http.post(this.urlBase, documento);
  }

  /*
  public actualizarCategoria(categoria: CategoriaDTO){
    return this.http.put(this.urlBase, categoria);
  }

  */
  public eliminarDocumento(id:number){
    return this.http.delete(`${this.urlBase}/${id}`);
  }
    

}
