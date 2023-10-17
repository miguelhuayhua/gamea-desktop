import React, { useContext } from "react";
import {
    Document,
    Page,
    Text,
    StyleSheet,
    View,
    Image,
    Svg,
    Line,
} from "@react-pdf/renderer";
import dayjs from "dayjs";
import { accionesContext } from "./seguimiento-cuenta";
import { Persona, meses } from "../personal/data";
import { AccionesUsuario } from "./data";
const PdfAcciones = () => {
    const data = useContext(accionesContext);
    let { persona, acciones, rangeAcciones } = data as {
        persona: Persona,
        acciones: AccionesUsuario[],
        rangeAcciones: { de: any, hasta: any }
    };
    const styles = StyleSheet.create({
        textBold: {
            fontFamily: "Helvetica-Bold",
            fontSize: 10,
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
            fontSize: 10,
            marginTop: 10,
        },
        page: {
            paddingLeft: 25,
            paddingRight: 30,
            paddingVertical: 15,
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
            marginTop: 5,
        },
        signatureBox: {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            fontSize: 10,
            justifyContent: "center",
            marginRight: 20,
        },
        table: {
            width: "98%",
            marginTop: 10,
            marginHorizontal: "auto",
        },
        row: {
            display: "flex",
            flexDirection: "row",
        },
        cellHeader: {
            backgroundColor: "#202123",
            color: "white",
            fontFamily: "Helvetica-Bold",
            fontSize: 10,
            textAlign: "center",
            width: "20%",
            border: "1px solid gray",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
        },
        cell: {
            fontFamily: "Helvetica",
            fontSize: 8,
            textAlign: "center",
            width: "20%",
            border: "1px solid gray",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
        },
    });

    return (
        <>
            <Document>
                <Page style={styles.page} orientation="landscape" size={"LETTER"}>
                    <Text
                        style={{
                            position: "absolute",
                            top: 5,
                            left: 50,
                            color: "gray",
                            fontSize: 8,
                        }}
                    >
                        Generado por:{" "}
                        {`${persona.nombres} ${persona.paterno} ${persona.materno}`}
                    </Text>
                    <Text
                        style={{
                            position: "absolute",
                            top: 5,
                            right: 60,
                            color: "gray",
                            fontSize: 8,
                        }}
                    >
                        Fecha y hora:{" "}
                        {`${dayjs().date()}/${dayjs().month()}/${dayjs().year()}-${dayjs().hour()}:${dayjs().minute()}:${dayjs().second()}`}
                    </Text>
                    <Image
                        style={{
                            width: 60,
                            height: 60,
                            position: "absolute",
                            top: 15,
                            left: 5,
                        }}
                        src={"/assets/logo-elalto.png"}
                    ></Image>
                    <Image
                    
                        style={{
                            width: 80,
                            height: 50,
                            position: "absolute",
                            top: 10,
                            right: 5,
                        }}
                        src={"/assets/logo-gamea.png"}
                    ></Image>
                    <Text style={{ ...styles.textBold, ...styles.textCenter }}>
                        GOBIERNO AUTÓNOMO MUNICIPAL DE EL ALTO
                    </Text>
                    <Svg height="3" width="650">
                        <Line
                            x1="90"
                            y1="2"
                            x2="650"
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
                        DIRECCCIÓN DE DESARROLLO INTEGRAL UNIDAD DE ADULTOS MAYORES
                    </Text>
                    <Text style={{ ...styles.textBold, ...styles.textCenter }}>
                        PROGRAMA DE DEFENSA Y RESTITUCIÓN DE DERECHOS DEL ADULTO MAYOR
                    </Text>

                    <Text style={{ ...styles.bigTitle, marginVertical: 10 }}>
                        HISTORIAL DE ACCIONES DE {`${persona.nombres.toUpperCase()} ${persona.paterno.toUpperCase()} ${persona.materno.toUpperCase()}`}
                    </Text>
                    <Text style={{ ...styles.parraf, color: 'gray' }}>
                        {rangeAcciones.de ? `Datos filtrados desde el ${dayjs(rangeAcciones.de).format("DD-MM-YYYY-hh:mm:ss")} ---- hasta el ${dayjs(rangeAcciones.hasta).format("DD-MM-YYYY-hh:mm:ss")} ` : null}
                    </Text>
                    <View style={styles.table}>
                        <View style={styles.row}>
                            <View style={styles.cellHeader}>
                                <Text>ID Acción</Text>
                            </View>
                            <View style={styles.cellHeader}>
                                <Text>Fecha de acción</Text>
                            </View>

                            <View style={styles.cellHeader}>
                                <Text>Hora de acción</Text>
                            </View>
                            <View style={styles.cellHeader}>
                                <Text>Tabla</Text>
                            </View>

                            <View style={styles.cellHeader}>
                                <Text>Tipo</Text>
                            </View>

                        </View>
                        {acciones.map((value, index) => {
                            return (
                                <View key={index} style={styles.row}>
                                    <View style={styles.cell}>
                                        <Text>{value.id_accion}</Text>
                                    </View>
                                    <View style={styles.cell}>
                                        <Text>{dayjs(value.fecha_hora_accion).format("DD/MM/YYYY")}</Text>
                                    </View>
                                    <View style={styles.cell}>
                                        <Text>
                                            {dayjs(value.fecha_hora_accion).format("HH:mm:ss")}
                                        </Text>
                                    </View>

                                    <View style={styles.cell}>
                                        <Text>{value.tabla}</Text>
                                    </View>
                                    <View style={styles.cell}>
                                        <Text>{value.tipo}</Text>
                                    </View>
                                </View>
                            );
                        })}
                    </View>
                    <Text style={{ ...styles.parraf, ...styles.textEnd }}>
                        El Alto, {dayjs().date()} de {meses[dayjs().month()]} de{" "}
                        {dayjs().year()}
                    </Text>

                    <View
                        style={{
                            width: 200,
                            marginHorizontal: "auto",
                            borderTop: "1px solid black",
                            marginTop: 40,
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

                    <View fixed style={{ position: "absolute", bottom: 10, left: 40 }}>
                        <Text
                            fixed
                            style={{ width: "100%", fontSize: 7, textAlign: "center" }}
                        >
                            Avenida Costanera Nro. 5002, urbanización libertad entre calles
                            J.J. Torres y Hernán Siles.
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
        </>
    );
};

export default PdfAcciones;
