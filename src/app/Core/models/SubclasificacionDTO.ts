export interface SubclasificacionDTO {
    id?: number,
    nombre: string;
    descripcion: string;
    clasificacionID: number;
}

export interface SubclasificacionExtendidaDTO extends SubclasificacionDTO {
    clasificacionNombre: string;
  }