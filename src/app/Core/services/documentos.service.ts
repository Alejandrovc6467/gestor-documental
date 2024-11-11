import { inject, Injectable } from '@angular/core';
import { CategoriaDTO } from '../models/CategoriaDTO';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DocumentoDTO } from '../models/DocumentoDTO';
import { DocumentoGetById, DocumentoGetDTO } from '../models/DocumentoGetDTO';
import { EliminarDTO } from '../models/EliminarDTO';

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

  
  public obtenerDocumentoPorId(id:number): Observable<DocumentoGetDTO>{
    return this.http.get<DocumentoGetDTO>(`${this.urlBase}/${id}`);
  }

  public obtenerDocumentoPorIdParaEditar(id:number): Observable<DocumentoGetById>{
    return this.http.get<DocumentoGetById>(`${this.urlBase}/${id}`);
  }
  

  public crearDocumento(documento: DocumentoDTO){
    return this.http.post(this.urlBase, documento);
  }

  
  public actualizarDocumento(documento: DocumentoDTO){
    return this.http.put(this.urlBase, documento);
  }

  


  public eliminarDocumento(eliminarDTO: EliminarDTO): Observable<any> {
    return this.http.delete(this.urlBase, { body: eliminarDTO });
  }
    

}
