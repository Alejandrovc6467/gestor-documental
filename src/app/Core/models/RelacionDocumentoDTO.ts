export interface RelacionDocumentoDTO {
    id?: number,
    docto: number;
    docRelacionado: string;
}


export interface RelacionDocumentoExtendidaDTO extends RelacionDocumentoDTO {
    nombreDocto: string;
}