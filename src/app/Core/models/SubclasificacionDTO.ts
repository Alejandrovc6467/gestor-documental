export interface SubclasificacionDTO {
    id?: number,
    nombre: string;
    descripcion: string;
    clasificacionID: number;
    eliminado: boolean;
    usuarioID: number;
    oficinaID: number;
}

export interface SubclasificacionExtendidaDTO extends SubclasificacionDTO {
    clasificacionNombre: string;
  }