export interface AccionesUsuario {
  id_accion: string;
  fecha_hora_accion: string;
  tabla: string;
  tipo: string;
  id_usuario: string;
}

export let dataAccionesUsuario = {
  id_accion: "",
  fecha_hora_accion: "",
  tabla: "",
  tipo: "",
  id_usuario: "",
};

export interface AccesoUsuario {
  id_acceso: string;
  fecha_hora_acceso: string;
  fecha_hora_salida: string;
  estado: number;
  id_usuario: string;
}

export let dataAccesoUsuario = {
  id_acceso: "",
  fecha_hora_acceso: "",
  fecha_hora_salida: "",
  estado: 1,
  id_usuario: "",
};
