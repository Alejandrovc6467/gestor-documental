export interface VersionDTO {
    id?: number; 
    documentoID: number; 
    numeroVersion: number; 
    fechaCreacion: string; 
    eliminado: boolean;
    usuarioID: number; 
    docDinamico: boolean; 
    obsoleto: boolean; 
    numeroSCD: string; 
    justificacion: string; 
    UsuarioLogID: number;
    OficinaID: number
    archivo?: File | null;
    urlVersion?: string
   
  }
  
  export interface IDocumentoDto {
    id: number | null;
    documentoID: number | null;
    numeroVersion: number | null;
    fechaCreacion: string | null;
    eliminado: boolean | null;
    usuarioID: number | null;
    docDinamico: boolean | null;
    obsoleto: boolean | null;
    numeroSCD: string | null;
    justificacion: string | null;
    usuarioLogID: number | null;
    oficinaID: number | null;
    archivo: File | null;
  }
  
