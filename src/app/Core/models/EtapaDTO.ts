export interface EtapaDTO {
    id?: number,
    nombre: string;
    descripcion: string;
    eliminado:boolean;
    color:string;
    etapaPadreID:number;
    normaID: number;
    consecutivo: number;
    usuarioID: number;
    oficinaID: number;
}

export interface EtapaExtendidaDTO extends EtapaDTO {
    normaNombre: string;
    etapaPadreNombre: string;
  }