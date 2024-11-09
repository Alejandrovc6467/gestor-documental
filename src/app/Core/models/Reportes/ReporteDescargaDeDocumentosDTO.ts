export interface ReporteDescargaDeDocumentosDTO {
    codigoDocumento: string;
    nombreDocumento: string;
    acceso: string;
    version: number;
    fecha: string;
    oficinaResponsable: string;
    visualizaciones:number;
    descargas:number;
}