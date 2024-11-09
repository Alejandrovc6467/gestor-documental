

export interface DocumentoDTO {
  id?: number;
  codigo: string;
  asunto: string;
  descripcion: string;
  palabraClave: string[];
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
  doctoId: number;
  clasificacionID: number;
  normaID: number;
  versionID: number;
  usuarioID: number;
  oficinaUsuarioID: number;
}



/*
export interface DocumentoDTO {
    id?: number,
    codigo: string;
    asunto: string;
    descripcion: string;
    palabraClave: string[];
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
    usuarioID: number;
    oficinaUsuarioID: number;
}

*/