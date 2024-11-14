export interface LoginResponse {
    id: number;
    nombre: string;
    apellido: string;
    correo: string;
    password: string;
    rolID: number;
    activo: boolean;
    eliminado: boolean;
  }