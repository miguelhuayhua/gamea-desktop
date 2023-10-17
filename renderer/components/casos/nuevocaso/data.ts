import dayjs from "dayjs";
import moment from "moment";
import { Hijo } from "../../hijos/data";

export const dias = [
    "Dom",
    "Lun",
    "Mar",
    "Mie",
    "Jue",
    "Vie",
    "Sab",
];
export const dias2 = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
]

export const meses = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
];


//esquemas
export interface AdultoMayor {

    nombre: string;
    paterno: string;
    materno: string;
    genero: string;
    edad: number;
    ci: number;
    f_nacimiento: string;
    nro_referencia: number;
    estado_civil: string;
    hijos: string[];
    grado: string;
    ocupacion: string;
    beneficios: string;
    expedido?: string;

}
export interface AdultoMayor2 {

    nombre: string;
    paterno: string;
    materno: string;
    genero: string;
    edad: number;
    ci: number;
    f_nacimiento: string;
    nro_referencia: number;
    estado_civil: string;
    hijos: Hijo[];
    grado: string;
    ocupacion: string;
    beneficios: string;
    id_adulto: string;
    expedido?: string;

}
export interface DatosUbicacion {

    tipo_domicilio: string;
    distrito: number;
    zona: string;
    calle_av: string;
    nro_vivienda: number;
    area: string;
    otro_domicilio: string;
    otra_area: string;

}
export interface DatosDenunciado {
    nombres: string;
    paterno: string;
    materno: string;
    parentezco: string;
};
export interface DatosDenuncia {
    fecha_registro: string,
    hora_registro: string,
    tipologia: string,
    nro_caso: string
}
//datos
export let dataDatosGenerales = {
    ci: 0,
    edad: -dayjs("1960-01-01").diff(moment.now(), "years"),
    estado_civil: "Viudo(a)",
    f_nacimiento: "1960-01-01",
    materno: "",
    nombre: "",
    paterno: "",
    nro_referencia: 0,
    genero: "Femenino",
    hijos: [],
    grado: "Primaria",
    beneficios: "Ninguno",
    ocupacion: "",
    id_adulto: "",
    expedido:"LP"
};

export let dataDatosUbicacion = {
    area: "Urbano",
    otra_area: "",
    calle_av: "",
    distrito: 1,
    nro_vivienda: 0,
    tipo_domicilio: "Propio",
    zona: "",
    otro_domicilio: "",
};
export let departamentos = [
    { value: "LP", label: "La Paz" },
    { value: "CBB", label: "Cochabamba" },
    { value: "SCZ", label: "Santa Cruz" },
    { value: "OR", label: "Oruro" },
    { value: "CH", label: "Chuquisaca" },
    { value: "TJ", label: "Tarija" },
    { value: "PD", label: "Pando" },
    { value: "PT", label: "Potosí" },
    { value: "BN", label: "Beni" },
]
export let dataDatosDenunciado = {
    nombres: "",
    parentezco: "Hijo(a)",
    paterno: "",
    materno: "",

}
export let dataDatosDenuncia = {
    fecha_registro: dayjs().format('YYYY-MM-DD'),
    hora_registro: dayjs().format('HH:mm:ss'),
    tipologia: "Abandono",
    nro_caso: ""

}
export interface Citado {
    id_citado: string;
    nombres_apellidos: string;
    genero: string;
    citado: number;
}
export let nro_citacion: string[] = [
    "Primera", "Segunda", "Tercera", "Cuarta", ""
]

export interface Audiencia {
    id_audiencia_suspendida: string;
    causa: string;
    observacion: string;
    ult_modificacion: string;
    estado: number;

    id_citacion: string;
}

export let dataAudiencia = {
    id_audiencia_suspendida: "",
    causa: "ina_adulto",
    observacion: "",
    ult_modificacion: "",
    estado: 1,
    id_citacion: "",
}