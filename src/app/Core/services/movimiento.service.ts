import { inject, Injectable } from '@angular/core';
import { MovimientoDTO } from '../models/MovimientoDTO';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';



@Injectable({
  providedIn: 'root'
})
export class MovimientoService {
  private http = inject(HttpClient);
  private urlBase = "http://gestordocumental.somee.com/api/BitacoraMovimiento";// esto se haria mas profesional creando un enviroment, que son ambiemtes de desarrolo uno para pruebas y otro para produccion


  

  constructor() { }

  public RegistrarMovimiento(movimiento: MovimientoDTO){
    return this.http.post(this.urlBase, movimiento);
  }

}
