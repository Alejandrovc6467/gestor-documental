export interface DocumentoGetDTO {
    normaID?: number;
    versionID?: number;
    clasificacionID?: number;
    id?: number;
    codigo?: string;
    asunto?: string;
    descripcion?: string;
    palabraClave?: string;
    categoriaID?: number;
    tipoDocumento?: number;
    oficinaID?: number;
    vigencia?: string;
    etapaID?: number;
    subClasificacionID?: number;
    doctos?: any[]; // Puedes reemplazar 'any' con un tipo más específico si conoces la estructura de 'doctos'
    activo?: boolean;
    descargable?: boolean;
    doctoId?: number;
}



//hay que agregar "oficinaNombre" a esto, por el momento esta con un valor x, no puedo hacer el editar entoces calavera
export interface DocumentoGetExtendidaDTO extends DocumentoGetDTO {
    categoriaNombre: string;
    tipoDocumentoNombre: string;
    etapaNombre: string;
    normaNombre: string;
    doctoNombre: string;
    clasificacionNombre: string;
    subClasificacionNombre: string;
}