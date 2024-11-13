
export interface ArchivoDTO {
    contentType: string;
    contentDisposition: string;
    headers: {
      "Content-Type": string[];
    };
    length: number;
    name: string | null;
    fileName: string;
}


export interface FiltroVerticalGetDTO {
    archivo: ArchivoDTO;
    id: number;
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
    doctos: any[]; // Puedes especificar un tipo más específico si tienes más detalles sobre los doctos
    activo: boolean;
    descargable: boolean;
    doctoId: number;
    clasificacionID: number;
    normaID: number;
    versionID: number;
    urlArchivo: string;
}


  export interface FiltroVerticalGetExtendidaDTO extends FiltroVerticalGetDTO {
    categoriaNombre: string;
    tipoDocumentoNombre: string;
    normaNombre: string;
    doctoNombre: string;
    clasificacionNombre: string;
}