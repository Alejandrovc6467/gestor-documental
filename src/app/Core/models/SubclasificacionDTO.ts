export interface SubclasificacionDTO {
    id?: number,
    nombre: string;
    descripcion: string;
    clasificacionID: number;
    eliminado: boolean;
}

export interface SubclasificacionExtendidaDTO extends SubclasificacionDTO {
    clasificacionNombre: string;
  }