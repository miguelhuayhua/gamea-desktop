import { Hijo } from "../hijos/data";

export interface Adulto {
  nombre: string;
  paterno: string;
  materno: string;
  genero: string;
  edad: number;
  ci: number;
  f_nacimiento: string;
  nro_referencia: number;
  estado_civil: string;
  grado: string;
  ocupacion: string;
  beneficios: string;
  id_adulto: string;
  estado: number;
  ult_modificacion: string;
  hijos: Hijo[];
  expedido?: string;
}

export let dataAdulto = {
  nombre: "",
  paterno: "",
  materno: "",
  genero: "",
  edad: 10,
  ci: 0,
  f_nacimiento: "1960/01/01",
  nro_referencia: 0,
  estado_civil: "",
  grado: "",
  ocupacion: "",
  beneficios: "",
  id_adulto: "",
  estado: 0,
  ult_modificacion: "",
  hijos: [],
  expedido: "",
};
export interface Domicilio {
  id_domicilio: string;
  distrito: string;
  zona: string;
  calle_av: string;
  nro_vivienda: number;
  area: string;
  otra_area: string;
  actual: number;
  estado: string;
  ult_modificacion: string;
  id_adulto: string;
  tipo_domicilio: string;
  otro_domicilio: string;
}

export let dataDomicilio = {
  id_domicilio: "",
  distrito: "",
  zona: "",
  calle_av: "",
  nro_vivienda: 0,
  area: "",
  otra_area: "",
  actual: 0,
  estado: "",
  ult_modificacion: "",
  id_adulto: "",
  tipo_domicilio: "",
  otro_domicilio: "",
};
export const generarColorOscuro = () => {
  const letters = "345678";
  let color = "#";

  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 6)];
  }

  return color;
};
export const generarColorClaro = () => {
  const letters = "DEFDEF";
  let color = "#";

  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 6)];
  }

  return color;
};
