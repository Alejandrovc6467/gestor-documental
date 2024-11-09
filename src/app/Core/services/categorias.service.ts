import { inject, Injectable } from '@angular/core';
import { CategoriaDTO } from '../models/CategoriaDTO';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EliminarDTO } from '../models/EliminarDTO';

@Injectable({
  providedIn: 'root'
})
export class CategoriasService {


  private http = inject(HttpClient);
  private urlBase = "http://gestordocumental.somee.com/api/Categoria";// esto se haria mas profesional creando un enviroment, que son ambiemtes de desarrolo uno para pruebas y otro para produccion


  constructor() { }


  public obtenerCategorias(): Observable<CategoriaDTO[]>{
    return this.http.get<CategoriaDTO[]> (this.urlBase);
  }

  public obtenerCategoriaPorId(id:number): Observable<CategoriaDTO>{
    return this.http.get<CategoriaDTO>(`${this.urlBase}/${id}`);
  }
  public crearCategoria(categoria: CategoriaDTO){
    return this.http.post(this.urlBase, categoria);
  }

  public actualizarCategoria(categoria: CategoriaDTO){
    return this.http.put(this.urlBase, categoria);
  }


  public eliminarCategoria(eliminarDTO: EliminarDTO): Observable<any> {
    return this.http.delete(this.urlBase, { body: eliminarDTO });
  }

}
