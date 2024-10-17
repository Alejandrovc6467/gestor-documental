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