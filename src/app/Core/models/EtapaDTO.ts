export interface EtapaDTO {
    id?: number,
    nombre: string;
    descripcion: string;
    normaId: number;
}

export interface EtapaExtendidaDTO extends EtapaDTO {
    normaNombre: string;
  }