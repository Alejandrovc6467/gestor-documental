export interface DocumentoVersionDTO {
    id?: number;
    documentoID: number;
    numeroVersion: number;
    fechaCreacion: string;
    eliminado: boolean;
    usuarioID: number;
    archivo?: File | null;
}
  