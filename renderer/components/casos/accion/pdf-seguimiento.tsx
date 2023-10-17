import React, { useContext } from "react";
import ReactPDF, {
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
import { Caso, Seguimiento } from "../data";
import { AdultoMayor2 } from "../nuevocaso/data";
import { DataContext } from "./seguimiento";

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
    fontFamily: "Helvetica",
    fontSize: 12,
    padding: 20,
    position: "relative",
  },
  textBox: {
    border: "1px solid black",
    borderRadius: 5,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 7.5,
    paddingVertical: 2,
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
    marginTop: 20,
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
const FormularioSeguimiento = (props: { caso: Caso, persona: Persona, seguimiento: Seguimiento, adulto: AdultoMayor2 }) => {
  const data = useContext(DataContext);
  let { caso, persona, seguimiento, adulto } = props;

  return (
    <Document>
      <Page style={styles.page}>
        <View style={{ position: "relative" }}>
          <Text
            style={{
              position: "absolute",
              top: -15,
              right: 20,
              color: "gray",
              fontSize: 8,
            }}
          >
            Generado por:
            {`${persona.nombres} ${persona.paterno} ${persona.materno}`}
          </Text>
          <Image
            style={{
              width: 70,
              height: 40,
              position: "absolute",
              top: -2.5,
              right: 2,
            }}
            src={"/assets/logo-gamea.png"}
          ></Image>

          <Image
            style={{
              width: 65,
              height: 50,
              position: "absolute",
              top: -2.5,
              left: 2,
            }}
            src={"/assets/logo-elalto.png"}
          ></Image>
          <Text
            style={{ ...styles.textBold, ...styles.textCenter, marginTop: 20 }}
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
          <Text style={{ ...styles.textBold, ...styles.textCenter }}>
            SECRETARÍA MUNICIPAL DE DESARROLLO HUMANO Y SOCIAL INTEGRAL
          </Text>
          <Text style={{ ...styles.textBold, ...styles.textCenter }}>
            DIRECCCIÓN DE DESARROLLO INTEGRAL UNIDAD DE ADULTOS MAYORES
          </Text>
          <Text style={{ ...styles.textBold, ...styles.textCenter }}>
            PROGRAMA DE DEFENSA Y RESTITUCIÓN DE DERECHOS DEL ADULTO MAYOR
          </Text>
          <View style={{ ...styles.horizontal, marginTop: 10 }}>
            <Text style={{ ...styles.parraf, color: "gray", fontSize: 8 }}>
              {"Fecha y hora de registro: " +
                seguimiento.fecha_seguimiento +
                " " +
                seguimiento.hora_seguimiento}
            </Text>
            <Text style={styles.textBold}>TIPOLOGÍA:</Text>
            <Text style={{ ...styles.textBox, ...styles.parraf }}>
              {caso.tipologia}
            </Text>
            <Text style={styles.textBold}>N° CASO:</Text>
            <Text style={{ ...styles.textBox, ...styles.parraf }}>
              {caso.nro_caso}
            </Text>
          </View>
          <Text style={styles.textBold}>
            I. NOMBRES Y APELLIDOS DE LA PERSONA ADULTA MAYOR:
          </Text>
          <Text style={{ ...styles.textBox, ...styles.parraf, marginTop: 2 }}>
            {adulto.nombre + " " + adulto.paterno + " " + adulto.materno}
          </Text>
          <Text style={{ ...styles.textBold, marginTop: 20 }}>
            II. DETALLES DEL SEGUIMIENTO DEL CASO:
          </Text>
          <Text
            style={{
              ...styles.textBox,
              ...styles.parraf,
              marginTop: 2,
              fontFamily: "Helvetica-Oblique",
            }}
          >
            {seguimiento.detalle_seguimiento}
          </Text>
          <View style={{ ...styles.horizontal, marginTop: 50 }}>
            <View>
              <View
                style={{
                  ...styles.horizontal,
                  width: 300,
                  justifyContent: "flex-start",
                }}
              >
                <Text style={{ fontSize: 10 }}>Firma:</Text>
                <View
                  style={{
                    height: 10,
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
                <Text style={{ fontWeight: "bold", fontSize: 10 }}>
                  Nombre Completo:
                </Text>
                <Text
                  style={{
                    borderBottom: "0.5px solid black",
                    paddingHorizontal: 10,
                    fontSize: 10,
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
                <Text style={{ fontWeight: "bold", fontSize: 10 }}>
                  N° Celular:
                </Text>
                <Text
                  style={{
                    borderBottom: "0.5px solid black",
                    fontSize: 10,
                    paddingHorizontal: 10,
                    marginLeft: 10,
                  }}
                >
                  {adulto.nro_referencia}
                </Text>
              </View>
            </View>
            <View style={styles.signatureBox}>
              <Text style={{ borderTop: "0.5px solid black", paddingTop: 10 }}>
                {persona.profesion +
                  " " +
                  persona.nombres +
                  " " +
                  persona.paterno +
                  " " +
                  persona.materno}
              </Text>
              <Text>Sello y Firma del (la) profesional</Text>
            </View>
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
