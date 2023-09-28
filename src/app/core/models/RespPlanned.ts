export interface RespPlanned {
  codigo:         number;
  msg:            string;
  totalRegistros: number;
  datos:          Planned[];
}

export interface Planned {
  idPlanned:        string;
  idCliente:        string;
  cliente:          string;
  usuario:          string;
  fecha_programada: Date;
  situacion:        string;
  estado:           boolean;
  creado_el:        Date;
  creado_por:       string;
  modificado_el:    Date;
  modificado_por:   string;
  uid:              string;
}
