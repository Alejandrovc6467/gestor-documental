import { inject, Injectable } from '@angular/core';
import { CategoriaDTO } from '../models/CategoriaDTO';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { FiltroVerticalGetDTO } from '../models/FiltroVerticalGetDTO';

@Injectable({
  providedIn: 'root'
})
export class FiltroVerticalService {

  private http = inject(HttpClient);
  private urlBase = "http://gestordocumental.somee.com/api/Documento/ConsultarDocumentos";// esto se haria mas profesional creando un enviroment, que son ambiemtes de desarrolo uno para pruebas y otro para produccion



  private urlBaseDescargar = "http://gestordocumental.somee.com/api/Archivo";// esto se haria mas profesional creando un enviroment, que son ambiemtes de desarrolo uno para pruebas y otro para produccion

  

  constructor() { }


  public obtenerFiltroVertical(): Observable<FiltroVerticalGetDTO[]>{
    return this.http.get<FiltroVerticalGetDTO[]> (this.urlBase);
  }

   // Método actualizado para descargar archivo
   public descargarArchivo(ruta: string): Observable<Blob> {
    // Codificar la ruta para manejar caracteres especiales
    const rutaCodificada = encodeURIComponent(ruta);

    const headers = new HttpHeaders({
      'accept': 'text/plain' // Actualizado según el curl proporcionado
    });

    return this.http.get(`${this.urlBaseDescargar}/${rutaCodificada}`, {
      headers: headers,
      responseType: 'blob'
    });
  }

  // Método mejorado para manejar la descarga
  public manejarDescargaArchivo(rutaArchivo: string): void {
    
    this.descargarArchivo(rutaArchivo).subscribe({
      next: (blob: Blob) => {
        // Extraer el nombre del archivo de la ruta
        const nombreArchivo = rutaArchivo.split('\\').pop() || 'documento';
        
        // Crear y descargar el archivo
        this.descargarBlob(blob, nombreArchivo);
      },
      error: (error) => {
        console.error('Error al descargar el archivo:', error);
        this.mostrarErrorDescarga();
      }
    });
  }

  // Método auxiliar para descargar el blob
  private descargarBlob(blob: Blob, nombreArchivo: string): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = nombreArchivo;
    
    // Descargar archivo
    document.body.appendChild(link);
    link.click();
    
    // Limpieza
    setTimeout(() => {
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }, 100);
  }

  // Método para mostrar error
  private mostrarErrorDescarga(): void {
    Swal.fire({
      icon: 'error',
      title: 'Error en la descarga',
      text: 'No se pudo descargar el archivo. Por favor, intente nuevamente.',
      confirmButtonText: 'Aceptar'
    });
  }
}