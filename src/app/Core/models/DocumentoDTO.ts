export interface DocumentoDTO {
    id?: number,
    codigo: string;
    asunto: string;
    descripcion: string;
    palabraClave: string;
    categoriaID: number;
    tipoDocumento: number;
    oficinaID: number;
    vigencia: string;
    etapaID: number;
    subClasificacionID: number;
    doctos: {
      docto: number;
      docRelacionado: string;
    }[];
    activo: boolean;
    descargable: boolean;
    doctoID: number;
}