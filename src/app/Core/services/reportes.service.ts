import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

//Lo que se envia a consultar
import { ConsultaReporteBitacoraDeMovimientoDTO } from '../models/Reportes/ConsultaReporteBitacoraDeMovimientoDTO';
import { ConsultaReporteControlDeVersionesDTO } from '../models/Reportes/ConsultaReporteControlDeVersionesDTO';
import { ConsultaReporteDescargaDeDocumentosDTO } from '../models/Reportes/ConsultaReporteDescargaDeDocumentosDTO';
import { ConsultaReporteDocSinMovimientoDTO } from '../models/Reportes/ConsultaReporteDocSinMovimientoDTO';
import { ConsultaReporteDocumentosAntiguosDTO} from '../models/Reportes/ConsultaReporteDocumentosAntiguosDTO';
import { ConsultaReporteMaestroDocumentoPorNormaDTO } from '../models/Reportes/ConsultaReporteMaestroDocumentoPorNormaDTO';
import { ConsultaReporteMaestroDocumentosDTO } from '../models/Reportes/ConsultaReporteMaestroDocumentosDTO';

//Lo que se recibe
import { ReporteBitacoraDeMovimientoDTO } from '../models/Reportes/ReporteBitacoraDeMovimientoDTO';
import { ReporteControlDeVersionesDTO } from '../models/Reportes/ReporteControlDeVersionesDTO';
import { ReporteDescargaDeDocumentosDTO } from '../models/Reportes/ReporteDescargaDeDocumentosDTO';
import { ReporteDocumentosAntiguosDTO } from '../models/Reportes/ReporteDocumentosAntiguosDTO';
import { ReporteMaestroDocumentoPorNormaDTO } from '../models/Reportes/ReporteMaestroDocumentoPorNormaDTO';
import { ReporteMaestroDocumentosDTO } from '../models/Reportes/ReporteMaestroDocumentosDTO';
import { ReportesDocSinMovimientoDTO } from '../models/Reportes/ReportesDocSinMovimientoDTO';

@Injectable({
  providedIn: 'root'
})
export class ReportesService {

  private http = inject(HttpClient);
  private urlBitacoraMovimientos = "http://gestordocumental.somee.com/api/Reportes/ReporteBitacoraDeMovimiento";// esto se haria mas profesional creando un enviroment, que son ambiemtes de desarrolo uno para pruebas y otro para produccion
  private urlControlVersiones = "http://gestordocumental.somee.com/api/Reportes/ReporteControlDeVersiones";
  private urlDocumentosAntiguos = "http://gestordocumental.somee.com/api/Reportes/ReporteDocumentosAntiguos";
  private urlMaestroDocumentos = "http://gestordocumental.somee.com/api/Reportes/ReporteMaestroDocumentos";
  private urlMaestroDocumentosNorma = "http://gestordocumental.somee.com/api/Reportes/ReporteMaestroDocumentoPorNorma";
  private urlDescargaDocumentos = "http://gestordocumental.somee.com/api/Reportes/ReporteDescargaDeDocumentos";
  private urlDocumentosSINMovimiento = "http://gestordocumental.somee.com/api/Reportes/ReportesDocSinMovimiento";
  

 
  

  constructor() { }


  getReporteBitacoraDeMovimiento(params: ConsultaReporteBitacoraDeMovimientoDTO): Observable<ReporteBitacoraDeMovimientoDTO[]> {
    let httpParams = new HttpParams();
    
    if (params.oficinaID) {
      httpParams = httpParams.set('oficinaID', params.oficinaID.toString());
    }
    
    if (params.usuarioID) {
      httpParams = httpParams.set('usuarioID', params.usuarioID.toString());
    }
    
    if (params.nombreDocumento) {
      httpParams = httpParams.set('nombreDocumento', params.nombreDocumento);
    }
    
    if (params.codigoDocumento) {
      httpParams = httpParams.set('codigoDocumento', params.codigoDocumento);
    }
    
    if (params.fechaInicio) {
      httpParams = httpParams.set('fechaInicio', params.fechaInicio);
    }
    
    if (params.fechaFin) {
      httpParams = httpParams.set('fechaFin', params.fechaFin);
    }
  
    return this.http.get<ReporteBitacoraDeMovimientoDTO[]>(`${this.urlBitacoraMovimientos}`, { params: httpParams });
  }

  getReporteControlDeVersiones(params: ConsultaReporteControlDeVersionesDTO): Observable<ReporteControlDeVersionesDTO[]> {
    let httpParams = new HttpParams()
    if (params.codigoDocumento) {
      httpParams = httpParams.set('CodigoDocumento', params.codigoDocumento);
    }
    
    if (params.nombreDocumento) {
      httpParams = httpParams.set('NombreDocumento', params.nombreDocumento);
    }
    
    if (params.tipoDocumento !== null && params.tipoDocumento !== undefined) {
      httpParams = httpParams.set('TipoDocumento', params.tipoDocumento.toString());
    }

    return this.http.get<ReporteControlDeVersionesDTO[]>(`${this.urlControlVersiones}`, { params: httpParams });
  }

  getReporteDescargaDeDocumentos(params: ConsultaReporteDescargaDeDocumentosDTO): Observable<ReporteDescargaDeDocumentosDTO[]> {
    let httpParams = new HttpParams();
    
    if (params.oficina) {
      httpParams = httpParams.set('oficina', params.oficina.toString());
    }
    
    if (params.usuario) {
      httpParams = httpParams.set('usuario', params.usuario.toString());
    }
    
    if (params.codigoDocumento) {
      httpParams = httpParams.set('codigoDocumento', params.codigoDocumento);
    }
    
    if (params.nombreDocumento) {
      httpParams = httpParams.set('nombreDocumento', params.nombreDocumento);
    }
    
    if (params.fechaInicio) {
      httpParams = httpParams.set('fechaInicio', params.fechaInicio);
    }
    
    if (params.fechaFinal) {
      httpParams = httpParams.set('fechaFinal', params.fechaFinal);
    }
  
    return this.http.get<ReporteDescargaDeDocumentosDTO[]>(`${this.urlDescargaDocumentos}`, { params: httpParams });
  }
  
  getReporteDocSinMovimiento(params: ConsultaReporteDocSinMovimientoDTO): Observable<ReportesDocSinMovimientoDTO[]> {
    let httpParams = new HttpParams();
    
    if (params.oficinaID) {
      httpParams = httpParams.set('oficinaID', params.oficinaID.toString());
    }
    
    if (params.tipoDocumento) {
      httpParams = httpParams.set('tipoDocumento', params.tipoDocumento);
    }
    
    if (params.fechaInicio) {
      httpParams = httpParams.set('fechaInicio', params.fechaInicio);
    }
    
    if (params.fechaFin) {
      httpParams = httpParams.set('fechaFin', params.fechaFin);
    }
  
    return this.http.get<ReportesDocSinMovimientoDTO[]>(`${this.urlDocumentosSINMovimiento}`, { params: httpParams });
  }
  
  getReporteDocumentosAntiguos(params: ConsultaReporteDocumentosAntiguosDTO): Observable<ReporteDocumentosAntiguosDTO[]> {
    let httpParams = new HttpParams();
    
    if (params.oficina) {
      httpParams = httpParams.set('oficina', params.oficina.toString());
    }
    
    if (params.tipoDocumento !== null && params.tipoDocumento !== undefined) {
      httpParams = httpParams.set('tipoDocumento', params.tipoDocumento.toString());
    }
    
    if (params.fecha) {
      httpParams = httpParams.set('fecha', params.fecha);
    }
  
    return this.http.get<ReporteDocumentosAntiguosDTO[]>(`${this.urlDocumentosAntiguos}`, { params: httpParams });
  }
  
  getReporteMaestroDocumentoPorNorma(params: ConsultaReporteMaestroDocumentoPorNormaDTO): Observable<ReporteMaestroDocumentoPorNormaDTO[]> {
    let httpParams = new HttpParams();
    
    if (params.oficina) {
      httpParams = httpParams.set('oficina', params.oficina.toString());
    }
    
    if (params.tipoDocumento !== null && params.tipoDocumento !== undefined) {
      httpParams = httpParams.set('tipoDocumento', params.tipoDocumento.toString());
    }
    
    if (params.norma) {
      httpParams = httpParams.set('norma', params.norma.toString());
    }
    
    if (params.categoria) {
      httpParams = httpParams.set('categoria', params.categoria.toString());
    }
  
    return this.http.get<ReporteMaestroDocumentoPorNormaDTO[]>(`${this.urlMaestroDocumentosNorma}`, { params: httpParams });
  }
  
  getReporteMaestroDocumentos(params: ConsultaReporteMaestroDocumentosDTO): Observable<ReporteMaestroDocumentosDTO[]> {
    let httpParams = new HttpParams();
    
    if (params.oficina) {
      httpParams = httpParams.set('oficina', params.oficina.toString());
    }
    
    if (params.tipoDocumento !== null && params.tipoDocumento !== undefined) {
      httpParams = httpParams.set('tipoDocumento', params.tipoDocumento.toString());
    }
  
    return this.http.get<ReporteMaestroDocumentosDTO[]>(`${this.urlMaestroDocumentos}`, { params: httpParams });
  }

}
