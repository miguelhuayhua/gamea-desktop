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
  Font,
} from "@react-pdf/renderer";

import { Persona, meses } from "../../personal/data";
import { Caso, Compromiso, Denunciado } from "../data";

import dayjs from "dayjs";

import { DataContext3 } from "./acta-compromiso";
import { Adulto } from "../../adultos/data";
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
  },
  listItem: {
    marginLeft: 40,
  },
});

// Create Document Component
const FormularioActaCompromiso = () => {
  const data = useContext(DataContext3);
  let { caso, persona, adulto, denunciado, compromisos } = data as {
    caso: Caso;
    persona: Persona;
    adulto: Adulto;
    denunciado: Denunciado;
    compromisos: Compromiso[];
  };

  let fechaCaso = dayjs(caso.fecha_registro, { format: "DD-MM-YYYY" });
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
              marginTop: 10,
            }}
            src={"/assets/logo-elalto.png"}
          ></Image>
          <Text style={{ ...styles.textBold, ...styles.textCenter }}>
            GOBIERNO AUTÓNOMO MUNICIPAL DE EL ALTO
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
          <Text style={{ ...styles.textBold, ...styles.textCenter }}>
            SECRETARÍA MUNICIPAL DE DESARROLLO HUMANO Y SOCIAL INTEGRAL
          </Text>
          <Text style={{ ...styles.textBold, ...styles.textCenter }}>
            DIRECCCIÓN DE DESARROLLO INTEGRAL UNIDAD DE ADULTOS MAYORES
          </Text>
          <Text style={{ ...styles.textBold, ...styles.textCenter }}>
            PROGRAMA DE DEFENSA Y RESTITUCIÓN DE DERECHOS DEL ADULTO MAYOR
          </Text>
          <Text style={{ ...styles.textBold, ...styles.textCenter }}>
            ACTA DE COMPROMISO DE BUENA CONDUCTA
          </Text>

          <Text style={{ ...styles.parraf, ...styles.textEnd }}>
            CASO: {caso.nro_caso}
          </Text>
          <Text style={styles.parraf}>
            En la ciudad de El Alto a los 11 días del mes de ABRIL del 2023, a
            horas 11:00 a.m. en instalaciones de la Unidad de Adultos Mayores -
            DDI - SMDHSI del Gobierno Autnónomo Municipal de El Alto, se hacen
            presente de manera libre voluntaria y sin que medie presión, dolo o
            vicio del consentimiento alguno{" "}
            {adulto.genero == "Feminino" ? "a la Sra." : "a el Sr."}{" "}
            <Text style={styles.textBold}>
              {adulto.nombre + " " + adulto.paterno + " " + adulto.materno} C.I.{" "}
              {adulto.ci + " " + adulto.expedido}
            </Text>{" "}
            y {denunciado.genero == "Femenino" ? "la Sra" : "el Sr."}{" "}
            <Text style={styles.textBold}>
              {denunciado.nombres +
                " " +
                denunciado.paterno +
                " " +
                denunciado.materno}{" "}
              con C.I. {denunciado.ci + " " + denunciado.expedido}
            </Text>
            , Para suscribir la presente ACTA DE COMPROMISO DE BUENA CONDUCTA el
            cual podrá ser elevado a un instrumento pública y/o homologado por
            la autoridad compentente a solicitud de cualquier de los
            suscribiente bajo el siguiente tenor:
          </Text>
          <Text style={styles.parraf}>
            <Text style={styles.textBold}>PRIMERO {"(ANTECEDENTES)"} </Text>- En
            fecha {fechaCaso.date()} de {meses[fechaCaso.month()]} del{" "}
            {fechaCaso.year()} se apresona a la Unidad de Adultos Mayores{" "}
            {adulto.genero == "Femenino" ? "la Sra." : "el Sr."}{" "}
            {adulto.nombre + " " + adulto.paterno + " " + adulto.materno}
            {" (adulto mayor)"} quien refiere:
          </Text>
          <Text style={styles.parraf}>{caso.descripcion_hechos}</Text>
          <Text style={styles.parraf}>
            <Text style={styles.textBold}>
              {" "}
              SEGUNDO {"(OBJETO DEL COMPROMISO)"}
            </Text>{" "}
            {denunciado.genero == "Femenino" ? "- Que la Sra." : "- Que el Sr."}
            {denunciado.nombres +
              " " +
              denunciado.paterno +
              " " +
              denunciado.materno}{" "}
            CON CI {denunciado.ci + " " + denunciado.expedido} de forma
            VOLUNTARIA se rige a la ley 708 de Conciliación y Arbitraje y se
            COMPROMETE a:
          </Text>

          {compromisos.map((compromiso, index) => (
            <Text key={index} style={{ ...styles.parraf, ...styles.listItem }}>
              {" • " + compromiso.compromiso}
            </Text>
          ))}
        </View>
        <View
          fixed
          style={{ position: "absolute", bottom: 15, marginLeft: 35 }}
        >
          <Text
            fixed
            style={{ width: "100%", fontSize: 7, textAlign: "center" }}
          >
            Avenida Costanera Nro. 5002, urbanización libertad entre calles J.J.
            Torres y Hernán Siles.
          </Text>
          <Text
            fixed
            style={{ width: "100%", fontSize: 7, textAlign: "center" }}
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
export default FormularioActaCompromiso;
