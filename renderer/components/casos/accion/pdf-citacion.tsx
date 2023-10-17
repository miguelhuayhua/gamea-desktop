import React, { useContext } from "react";
import {
  Document,
  Page,
  Text,
  StyleSheet,
  View,
  Image,
  Line,
  Svg,
} from "@react-pdf/renderer";

import { Persona } from "../../personal/data";
import { Caso, Citacion } from "../data";
import { AdultoMayor2, Citado, dias, dias2, meses } from "../nuevocaso/data";
import { DataContext2 } from "./citacion";
import dayjs from "dayjs";

// Create styles
//estilos
const styles = StyleSheet.create({
  textBold: {
    fontFamily: "Helvetica-Bold",
    fontSize: 12,
  },
  textCenter: {
    textAlign: "center",
  },
  textEnd: {
    textAlign: "right",
  },
  parraf: {
    lineHeight: 1.3,
    fontFamily: "Helvetica",
    fontSize: 12,
    marginTop: 12,
  },
  page: {
    paddingLeft: 25,
    paddingRight: 30,
    paddingVertical: 25,
  },
  listItem: {
    marginLeft: 40,
  },
  bigTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 15,
    textAlign: "center",
  },
  underline: {
    textDecoration: "underline",
  },
  horizontal: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
    width: "100%",
    marginTop: 10,
  },
  signatureBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    fontSize: 10,
    justifyContent: "center",
    marginRight: 20,
  },
});

// Create Document Component
const FormularioSeguimiento = () => {
  const data = useContext(DataContext2);
  let { caso, persona, adulto, nro_citacion, citacion, citados } = data as {
    caso: Caso;
    persona: Persona;
    adulto: AdultoMayor2;
    nro_citacion: string;
    citacion: Citacion;
    citados: Citado[];
  };
  let fecha = dayjs(citacion.fecha_citacion);
  let fecha_creacion = dayjs(citacion.fecha_creacion);
  return (
    <Document>
      <Page style={styles.page}>
        <View style={{ position: "relative" }}>
          <Text
            style={{
              position: "absolute",
              top: 0,
              right: 50,
              color: "gray",
              fontSize: 8,
            }}
          >
            Generado por:
            {`${persona.nombres} ${persona.paterno} ${persona.materno}`}
          </Text>

          <Image
            style={{
              width: 80,
              height: 50,
              marginHorizontal: "auto",
            }}
            src={"/assets/logo-elalto.png"}
          ></Image>
          <Text
            style={{ ...styles.textBold, ...styles.textCenter, marginTop: 20 }}
          >
            GOBIERNO AUTÓNOMO DE EL ALTO
          </Text>
          <Svg height="3" width="600">
            <Line
              x1="90"
              y1="2"
              x2="470"
              y2="2"
              strokeWidth={1}
              stroke="rgb(0,0,0)"
            />
          </Svg>
          <Text style={{ ...styles.textCenter, ...styles.textBold }}>
            SECRETARÍA MUNICIPAL DE DESARROLLO HUMANO Y SOCIAL INTEGRAL
          </Text>
          <Text style={{ ...styles.textCenter, ...styles.textBold }}>
            DIRECCCIÓN DE DESARROLLO INTEGRAL
          </Text>
          <Text style={{ ...styles.textCenter, ...styles.textBold }}>
            UNIDAD DE ADULTOS MAYORES
          </Text>
          <Text style={{ ...styles.textCenter, ...styles.textBold }}>
            PROGRAMA DE DEFENSA Y RESTITUCIÓN DE DERECHOS DEL ADULTO MAYOR
          </Text>
          <Text style={styles.parraf}>TIPOLOGÍA: {caso.tipologia}</Text>
          <Text style={styles.parraf}>N° CASO: {caso.nro_caso}</Text>
          <Text style={{ ...styles.bigTitle, ...styles.underline }}>
            {nro_citacion.toUpperCase() + " CITACIÓN"}
          </Text>
          <Text style={styles.parraf}>
            La unidad de Adultos Mayores, en el marco de sus atribuciones y
            competencias conferidas por la normativa vigente, cita a:
          </Text>

          {citados.map((citado, index) =>
            citado.citado == 1 ? (
              <Text
                key={index}
                style={{
                  ...styles.parraf,
                  ...styles.textCenter,
                  ...styles.textBold,
                }}
              >
                {citado.nombres_apellidos.toUpperCase()}
              </Text>
            ) : null
          )}
          <Text style={styles.parraf}>
            Apersonarse ante estas dependencias Unidad de Adultos Mayores,
            PLANTA BAJA JACHA UTA,(Alcaldía Municipal) para el día{" "}
            {dias2[fecha.day()]} {fecha.date()} de {meses[fecha.month()]} DE{" "}
            {fecha.year()} a horas {citacion.hora_citacion}, a objeto de tratar
            la situación{" "}
            {adulto.genero == "Masculino" ? "del Adulto" : "la Adulta "}Mayor{" "}
            <Text style={styles.textBold}>
              {adulto.nombre + " " + adulto.paterno + " " + adulto.materno}
            </Text>{" "}
            de {adulto.edad} años de edad.
          </Text>

          <Text style={styles.parraf}>
            El equipo multidisiciplinario de la Unidad de Adultos Mayores le
            informa que queda terminantemente PROHIBIDO EJERCER CUALQUIER TIPO
            DE MALTRATATO CONTRA{" "}
            {adulto.genero == "Masculino" ? "EL ADULTO" : "LA ADULTA"} MAYOR, y
            se le hace conocer que debe respetar sus derechos sin argüir
            desconocimiento.
          </Text>
          <Text style={{ ...styles.parraf, ...styles.textBold }}>
            DEBE PORTAR TODAS LAS MEDIDAS DE BIOSEGURIDAD AL MOMENTO DE ASITIR A
            NUESTRAS DEPENDENCIAS, ESTO CON EL FIN DE EVITAR LA PROPAGACIÓN DEL
            COVID-19
          </Text>
          <Text
            style={{
              ...styles.parraf,
              ...styles.textBold,
              ...styles.underline,
            }}
          >
            Se insinua puntualidad, portar su cédula de identidad y fotocopia
            del mismo.
          </Text>
          <Text style={{ ...styles.parraf, ...styles.textEnd }}>
            El Alto, {fecha_creacion.date()} de {meses[fecha_creacion.month()]}{" "}
            de {fecha_creacion.year()}
          </Text>

          <View
            style={{
              width: 200,
              marginHorizontal: "auto",
              borderTop: "1px solid black",
              marginTop: 150,
            }}
          >
            <Text
              style={{
                ...styles.parraf,
                ...styles.textCenter,
                ...styles.textBold,
              }}
            >
              {persona.profesion +
                " " +
                persona.nombres +
                " " +
                persona.paterno +
                " " +
                persona.materno}
            </Text>
            <Text
              style={{ ...styles.parraf, ...styles.textCenter, marginTop: 0 }}
            >
              {"Sello y Firma del (la) profesional"}{" "}
            </Text>
          </View>
        </View>
        <View
          fixed
          style={{
            position: "absolute",
            bottom: 15,
            width: "100%",
            marginLeft: 35,
          }}
        >
          <Text
            fixed
            style={{
              ...styles.parraf,
              ...styles.textCenter,
              fontSize: 8,
              width: "100%",
            }}
          >
            Avenida Costanera Nro. 5002, urbanización libertad entre calles J.J.
            Torres y Hernán Siles.
          </Text>
          <Text
            fixed
            style={{
              ...styles.parraf,
              ...styles.textCenter,
              fontSize: 8,
              marginTop: 2,
              width: "100%",
            }}
          >
            {
              "Zuazo, Casa Municipal (Jach'a Uta), a media cuadra de la Estación de Bomberos El Alto."
            }
          </Text>
        </View>
      </Page>
    </Document>
  );
};
export default FormularioSeguimiento;
