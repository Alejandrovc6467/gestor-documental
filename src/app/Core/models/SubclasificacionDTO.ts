export interface SubclasificacionDTO {
    id?: number,
    nombre: string;
    descripcion: string;
    clasificacionId: number;
}

export interface SubclasificacionExtendidaDTO extends SubclasificacionDTO {
    clasificacionNombre: string;
  }