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
import { Caso, Citacion, Compromiso, Denunciado } from "../data";
import {
  AdultoMayor2,
  Audiencia,
  Citado,
  dias,
  dias2,
  meses,
} from "../nuevocaso/data";
import { DataContext2 } from "./citacion";
import dayjs from "dayjs";
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
    lineHeight: 1.4,
    fontFamily: "Helvetica",
    fontSize: 12,
    marginTop: 12,
  },
  page: {
    paddingLeft: 35,
    paddingRight: 35,
    paddingVertical: 25,
  },
  listItem: {
    marginLeft: 40,
  },
  bigTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 18,
    textAlign: "center",
  },
  underline: {
    textDecoration: "underline",
  },
  horizontal: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  box: {
    width: 20,
    height: 20,
    border: "1px solid black",
    borderRadius: 5,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
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
const FormularioAudienciaSuspendida = (props: {
  caso: Caso;
  persona: Persona;
  adulto: AdultoMayor2;
  citacion: Citacion;
  audiencia: Audiencia;
}) => {
  let { caso, persona, adulto, citacion, audiencia } = props;
  let fecha_citacion = dayjs(citacion.fecha_citacion);
  return (
    <Document>
      <Page size={"LETTER"} style={styles.page}>
        <View style={{ position: "relative" }}>
          <Text
            style={{
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
              position: "absolute",
              right: -10,
              top: -15,
            }}
            src={"/assets/logo-gamea.png"}
          ></Image>
          <Text
            style={{ ...styles.textCenter, ...styles.textBold, marginTop: 10 }}
          >
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
          <Text
            style={{ ...styles.textBold, ...styles.textCenter, marginTop: 10 }}
          >
            SECRETARÍA MUNICIPAL DE DESARROLLO HUMANO Y SOCIAL INTEGRAL
          </Text>
          <Text style={{ ...styles.textBold, ...styles.textCenter }}>
            DIRECCCIÓN DE DESARROLLO INTEGRAL
          </Text>
          <Text style={{ ...styles.textBold, ...styles.textCenter }}>
            UNIDAD DE ADULTOS MAYORES
          </Text>
          <Text style={{ ...styles.textBold, ...styles.textCenter }}>
            PROGRAMA DE DEFENSA Y RESTITUCIÓN DE DERECHOS DEL ADULTO MAYOR
          </Text>
          <View style={{ ...styles.horizontal, marginTop: 30 }}>
            <Text style={styles.textBold}>CASO N°: </Text>
            <View
              style={{
                border: "1px solid black",
                borderRadius: 5,
                width: 100,
                padding: 2.5,
              }}
            >
              <Text style={{ ...styles.parraf, marginTop: 0 }}>
                {caso.nro_caso}
              </Text>
            </View>
          </View>
          <Text
            style={{ ...styles.textBold, ...styles.bigTitle, marginTop: 20 }}
          >
            AUDIENCIA SUSPENDIDA
          </Text>
          <Text style={styles.parraf}>
            En la ciudad de El Alto, a los {fecha_citacion.date()}
            días del mes de {meses[fecha_citacion.month()]} del año{" "}
            {fecha_citacion.year()} a horas {citacion.hora_citacion}, en el
            marco de la normativa legal vigente aplicable a esta población
            {" (Ley N° 369 y Ley N° 708)"}, en oficinas del Programa de Defensa
            y Restitución de Derechos de los Adultos Mayores, se{" "}
            <Text style={styles.textBold}> SUSPENDE LA CONCILIACIÓN </Text>
            señalada para la presente fecha, debido a:
          </Text>
          <View style={{ ...styles.horizontal, marginTop: 15 }}>
            <Text
              style={{ ...styles.parraf, ...styles.listItem, marginTop: 0 }}
            >
              {"A) Inasistencia del (la) Adulto (a) Mayor: "}
            </Text>
            <View style={styles.box}>
              {audiencia.causa == "ina_adulto" ? (
                <Text style={{ fontSize: 12, textAlign: "center" }}>X</Text>
              ) : (
                ""
              )}
            </View>
          </View>
          <View style={{ ...styles.horizontal, marginTop: 15 }}>
            <Text
              style={{ ...styles.parraf, ...styles.listItem, marginTop: 0 }}
            >
              {"B) Inasistencia de la Parte Invitada: "}
            </Text>
            <View style={styles.box}>
              {audiencia.causa == "ina_invitado" ? (
                <Text style={{ fontSize: 12, textAlign: "center" }}>X</Text>
              ) : (
                ""
              )}
            </View>
          </View>
          <View style={{ ...styles.horizontal, marginTop: 15 }}>
            <Text
              style={{ ...styles.parraf, ...styles.listItem, marginTop: 0 }}
            >
              {"C) Ambas Partes: "}
            </Text>
            <View style={styles.box}>
              {audiencia.causa == "ambos" ? (
                <Text style={{ fontSize: 12, textAlign: "center" }}>X</Text>
              ) : (
                ""
              )}
            </View>
          </View>
          <Text style={styles.parraf}>
            Observaciones:{" "}
            {audiencia.observacion == ""
              ? "Sin observaciones"
              : audiencia.observacion}
          </Text>
        </View>
        <View
          style={{
            ...styles.horizontal,
            marginTop: 100,
            justifyContent: "space-around",
          }}
        >
          <View>
            <View
              style={{
                ...styles.horizontal,
                width: 300,
                justifyContent: "flex-start",
              }}
            >
              <Text style={styles.textBold}>Firma:</Text>
              <View
                style={{
                  height: 15,
                  borderBottom: "0.5px solid black",
                  width: 150,
                  marginLeft: 10,
                }}
              ></View>
            </View>
            <View
              style={{
                ...styles.horizontal,
                width: 300,
                justifyContent: "flex-start",
              }}
            >
              <Text style={styles.textBold}>Nombre Completo:</Text>
              <Text
                style={{
                  ...styles.parraf,
                  borderBottom: "0.5px solid black",
                  paddingHorizontal: 10,
                  marginLeft: 10,
                }}
              >
                {adulto.nombre + " " + adulto.paterno + " " + adulto.materno}
              </Text>
            </View>
            <View
              style={{
                ...styles.horizontal,
                width: 300,
                justifyContent: "flex-start",
              }}
            >
              <Text style={styles.textBold}>N° Celular:</Text>
              <Text
                style={{
                  ...styles.parraf,
                  borderBottom: "0.5px solid black",
                  paddingHorizontal: 10,
                  marginLeft: 10,
                }}
              >
                {adulto.nro_referencia}
              </Text>
            </View>
          </View>
          <View style={styles.signatureBox}>
            <Text
              style={{
                ...styles.parraf,
                borderTop: "0.5px solid black",
                paddingTop: 5,
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
            <Text style={{ ...styles.parraf, marginTop: 2.5 }}>
              Sello y Firma del (la) profesional
            </Text>
          </View>
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
export default FormularioAudienciaSuspendida;
