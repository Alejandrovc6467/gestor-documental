export interface ReporteDescargaDeDocumentosDTO {
    codigoDocumento: string;
    nombreDocumento: string;
    acceso: string;
    version: number;
    fechaIngreso: string;
    oficinaResponsable: string;
    visualizaciones:number;
    descargas:number;
}