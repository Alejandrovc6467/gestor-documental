export interface UsuarioDTO {
    id: number;
    nombre: string;
    apellido: string;
    correo: string;
    password: string;
    rolID: number;
    activo: boolean;
    eliminado: boolean;
}
  


export interface UsuarioExtendidaDTO extends UsuarioDTO {
    rolNombre: string;
}