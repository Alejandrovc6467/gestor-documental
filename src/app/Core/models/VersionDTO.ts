export interface VersionDto {
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
    archivo: File;
  }
  