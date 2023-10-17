import React, { useContext } from "react";
import {
    Document,
    Page,
    Text,
    StyleSheet,
    View,
    Image,
} from "@react-pdf/renderer";

import {
    AdultoMayor2, meses,
} from "../nuevocaso/data";
import { Persona } from "../../personal/data";
import { Caso, Denunciado } from "../data";
import dayjs from "dayjs";

//estilos
const styles = StyleSheet.create({
    textItalic: { fontSize: 9, fontFamily: "Helvetica-Oblique" },
    title: {
        width: "100%",
        textAlign: "center",
        marginTop: 30,
        fontFamily: "Helvetica-Bold",
        fontSize: 20
    },
    page: {
        fontFamily: "Helvetica",
        fontSize: 12,
        padding: 30,
        position: "relative",
        paddingBottom: 35,
    },
    signatureBox: {
        display: "flex",
        flexDirection: "column",
        fontSize: 11,
        marginTop: 80,
        width: 250
    },
    textInfo: { width: "33%", color: "#999", textAlign: "center", fontSize: 8 },

    horizontal: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        flexWrap: "wrap",
    },
    text: {
        fontSize: 12,
    },
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
        lineHeight: 2,
        fontFamily: "Helvetica",
        fontSize: 12,
        marginTop: 20,
    },
    listItem: {
        marginLeft: 40,
    },
});
interface Props {
    persona: Persona;
    caso: Caso;
    adulto: AdultoMayor2;
    denunciado: Denunciado;
}
// Create Document Component
const ReporteCaso = (props: Props) => {
    let registro_caso = dayjs(props.caso.fecha_registro);

    return (
        <Document>
            <Page size={"LETTER"} style={styles.page}>
                <Text
                    style={{
                        position: "absolute",
                        top: 8,
                        right: 20,
                        color: "gray",
                        fontSize: 8,
                    }}
                >
                    Generado por:
                    {`${props.persona.nombres} ${props.persona.paterno} ${props.persona.materno}`}
                </Text>
                <Image
                    style={{
                        width: 80,
                        height: 50,
                        position: "absolute",
                        top: 20,
                        left: 20,
                    }}
                    src={"/assets/logo-gamea.png"}
                ></Image>
                <Text
                    style={{ ...styles.textBold, fontSize: 10, position: 'absolute', top: 30, left: 100 }}
                >
                    GOBIERNO AUTÓNOMO MUNICIPAL DE EL ALTO
                </Text>
                <Text
                    style={{ fontSize: 10, position: 'absolute', top: 42.5, left: 100 }}
                >
                    {"DIRECCCIÓN DE DESARROLLO INTEGRAL \n UNIDAD DE ADULTOS MAYORES"}
                </Text>
                <Text style={{ fontSize: 12, position: 'absolute', right: 60, top: 50 }}>
                    <Text style={styles.textBold}>Nro de Caso: </Text>
                    {props.caso.nro_caso}
                </Text>
                <View style={{ position: 'absolute', right: 60, top: 90, borderRadius: 5, border: '1px solid #777', padding: 15 }}>
                    <Text style={{ ...styles.text, marginBottom: 10 }}>
                        <Text style={styles.textBold}>Tipología: </Text>
                        {props.caso.tipologia}
                    </Text>
                    <Text style={styles.text}>
                        <Text style={styles.textBold}>Acción: </Text>
                        {props.caso.accion_realizada}
                    </Text>
                </View>
                <Text style={{ ...styles.text, marginTop: 70 }}>
                    <Text style={styles.textBold}>Fecha / hora caso: </Text>
                    {` ${props.caso.fecha_registro} - ${props.caso.hora_registro}`}
                </Text>
                <Text style={{ ...styles.text, marginTop: 5 }}>
                    <Text style={styles.textBold}>Adulto Mayor: </Text>
                    {`${props.adulto.genero == 'Feminino' ? 'Sra.' : 'Sr. '} ${props.adulto.nombre} ${props.adulto.paterno} ${props.adulto.materno}`}
                </Text>

                <Text style={styles.title}>REPORTE DE CASO</Text >
                <Text style={styles.parraf}>
                    {`En el registro de casos, se encuentra el caso ${props.caso.nro_caso}, registrado el ${registro_caso.day()} de ${meses[registro_caso.month()]} de ${registro_caso.year()}, a las ${props.caso.hora_registro}, bajo la tipología "${props.caso.tipologia}".
                    La víctima del caso siendo ${props.adulto.genero == 'Femenino' ? 'la Sra.' : "el Sr."} ${props.adulto.nombre} ${props.adulto.paterno} ${props.adulto.materno}, llevando a cabo la denuncia correspondiente dirigido ${props.denunciado.genero == 'Femenino' ? 'a la Sra.' : 'al Sr.'}: ${props.denunciado.nombres} ${props.denunciado.paterno} ${props.denunciado.materno}, con una relación de: "${props.denunciado.parentezco}" con el denunciante. 
                    Se llevó a cabo la acción de: "${props.caso.accion_realizada}" sobre el mismo.`}
                </Text>
                <View style={styles.signatureBox}>
                    <Text style={{ borderTop: "0.5px solid black", paddingTop: 9 }}>
                        {props.persona.profesion +
                            " " +
                            props.persona.nombres +
                            " " +
                            props.persona.paterno +
                            " " +
                            props.persona.materno
                        }
                    </Text>
                    <Text style={styles.textBold}>Sello y Firma del (la) profesional</Text>
                </View>
                <View fixed style={{ position: "absolute", bottom: 10, left: 20 }}>
                    <Text style={{ width: "100%", fontSize: 7, textAlign: "center" }}>
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
        </Document >
    );
};
export default ReporteCaso;
