export interface Denunciado {
  id_denunciado: string;
  nombres: string;
  paterno: string;
  materno: string;
  estado: number;
  ult_modificacion: string;
  id_caso: string;
  parentezco: string;
  genero: string;
  ci?: number;
  expedido?: string;
}

export let dataDenunciado: Denunciado = {
  id_denunciado: "",
  nombres: "",
  paterno: "",
  materno: "",
  estado: 0,
  ult_modificacion: "",
  id_caso: "",
  parentezco: "",
  genero: "",
  ci: 0,
  expedido: "LP",
};
