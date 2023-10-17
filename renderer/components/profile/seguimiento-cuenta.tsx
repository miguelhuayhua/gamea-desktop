import { Button, Col, DatePicker, Empty, Form, Row, Space, Table, Tooltip, notification } from "antd";
import { Content } from "antd/es/layout/layout";
import { AccesoUsuario, AccionesUsuario } from "./data";
import { NextPage } from "next";
import { ColumnsType } from "antd/es/table";
import dynamic from "next/dynamic";
const Paragraph = dynamic(async () => await import("antd/es/typography/Paragraph"), {
  ssr: false,
});  import dayjs from "dayjs";
import {
  FilePdfFilled,
} from "@ant-design/icons";
import { pdf } from "@react-pdf/renderer";
import { createContext, useState } from "react";
import { Persona, dias, meses } from "../personal/data";
import PdfAcciones from "./pdf-acciones";
interface Props {
  accionesUsuario: AccionesUsuario[];
  accesosUsuario: AccesoUsuario[];
  persona: Persona;
  displayAccionesUsuario: AccionesUsuario[];
  displayAccesosUsuario: AccesoUsuario[];
  setDisplayAccionesUsuario: any;
  setDisplayAccesosUsuario: any;
}
export const accesoContext = createContext({});
export const accionesContext = createContext({});
import isBeetwen from "dayjs/plugin/isBetween";
import PdfAccesos from "./pdf-accesos";


const SeguimientoCuenta: NextPage<Props> = (props) => {
  dayjs.extend(isBeetwen);

  const [rangeAcceso, setRangeAcceso] = useState<{ de: any, hasta: any }>({ de: null, hasta: null })
  const [rangeAcciones, setRangeAcciones] = useState<{ de: any, hasta: any }>({ de: null, hasta: null })
  //COLUMNAS

  const columnaAcciones: ColumnsType<AccionesUsuario> = [
    {
      title: "ID Acción",
      dataIndex: "id_denunciado",
      key: "id_denunciado",
      className: "text-center",
      fixed: "left",
      width: 110,
      render(_, accion) {
        return (
          <Paragraph className="center" copyable>
            {accion.id_accion}
          </Paragraph>
        );
      },
    },
    {
      title: "Fecha / Hora de Acción",
      key: "fecha_hora_accion",
      render(_, accion) {
        return (
          dayjs(accion.fecha_hora_accion).format("DD/MM/YYYY-HH:mm:ss")
        );
      },
      width: 200,
    },
    {
      title: "Tabla",
      key: "tabla",
      dataIndex: "tabla",
      className: "text-center",
      width: 120,
    },
    {
      title: "Tipo",
      key: "tipo",
      dataIndex: "tipo",

    },
  ];
  const { RangePicker } = DatePicker;

  const columnaAcceso: ColumnsType<AccesoUsuario> = [
    {
      title: "ID Acceso",
      key: "id_acceso",
      className: "text-center",
      fixed: "left",
      width: 120,
      render(_, acceso) {
        return (
          <Paragraph className="center" copyable>
            {acceso.id_acceso}
          </Paragraph>
        );
      },
    },
    {
      title: "Fecha / Hora de entrada",
      key: "fecha_hora_acceso",
      width: 150,
      dataIndex: "fecha_hora_acceso",
      className: "text-center",
      render(_, acceso) {
        return `${dayjs(acceso.fecha_hora_acceso).format("DD/MM/YYYY-HH:mm:ss")}`
      }
    },
    {
      title: "Fecha / Hora de salida",
      key: "fecha_hora_salida",
      width: 150,
      dataIndex: "fecha_hora_acceso",
      className: "text-center",
      render(_, acceso) {
        return `${dayjs(acceso.fecha_hora_salida).format("DD/MM/YYYY-HH:mm:ss")}`
      }
    },
  ];

  return (
    <>
      <Content>
        <Row gutter={[40, 24]}>
          <Col span={24} lg={{ span: 12 }}>
            <Tooltip
              title="Generar PDF"
              placement={"right"}
              color={"#b51308"}
              key={"pdf"}
            >
              <Button
                className="center info-button"
                style={{ height: 50, width: 50, minWidth: 50 }}
                icon={
                  <FilePdfFilled
                    style={{
                      color: "#b51308",
                      fontSize: 30,
                    }}
                  />
                }
                onClick={() => {
                  notification.info({
                    message: "Generando PDF, por favor espere...",
                  });
                  pdf(
                    <accesoContext.Provider
                      value={{
                        accesos: props.displayAccesosUsuario,
                        persona: props.persona,
                        rangeAcceso: rangeAcceso
                      }}
                    >
                      <PdfAccesos />
                    </accesoContext.Provider>
                  )
                    .toBlob()
                    .then((blob) => {
                      const url = URL.createObjectURL(blob);
                      const link = document.createElement("a");
                      link.href = url;
                      let nombrePdf = `Accesos-${dayjs().year()}-${dayjs().month()}-${dayjs().date()}.pdf`;
                      link.setAttribute("download", nombrePdf);
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                      notification.success({
                        message: "PDF " + nombrePdf + " generado con éxito...",
                      });
                    });
                }}
              />
            </Tooltip>

            <Form.Item label="Filtrar por rango de fechas:">
              <RangePicker
                locale={{

                  lang: {
                    locale: "es_ES", // Cambia "es_ES" al código de idioma que prefieras
                    month: "Mes",
                    year: "Año",
                    ok: "Aceptar",
                    previousMonth: "Mes anterior",
                    dayFormat: "D",
                    previousYear: "Año anterior",
                    nextYear: "Año siguiente",
                    previousDecade: "Década anterior",
                    nextDecade: "Década siguiente",
                    previousCentury: "Siglo anterior",
                    nextCentury: "Siglo siguiente",
                    shortWeekDays: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"],
                    shortMonths: [
                      "Ene",
                      "Feb",
                      "Mar",
                      "Abr",
                      "May",
                      "Jun",
                      "Jul",
                      "Ago",
                      "Sep",
                      "Oct",
                      "Nov",
                      "Dic",
                    ],
                    dateFormat: "YYYY-MM-DD",
                    dateTimeFormat: "YYYY-MM-DD HH:mm:ss",
                    monthFormat: "MMMM YYYY",
                    today: "Hoy",
                    now: "Ahora",
                    backToToday: "Volver",
                    clear: "Limpiar",
                    dateSelect: "Seleccionar fecha",
                    timeSelect: "Seleccionar hora",
                    placeholder: "Seleccionar fecha y hora", // Agregado el placeholder,
                    nextMonth: "Mes siguiente",
                    decadeSelect: "Seleccionar década",
                    monthSelect: "Seleccionar mes",
                    yearFormat: "YYYY",
                    yearSelect: "Seleccione año"
                  },
                  timePickerLocale: {
                    placeholder: "Seleccionar hora",
                    rangePlaceholder: ["Hora de inicio", "Hora de fin"],
                  },
                  // Otras propiedades del objeto locale


                }}
                onChange={(value: any) => {
                  if (value) {
                    let [inicio, final] = value;
                    setRangeAcceso({ de: inicio.$d, hasta: final.$d })
                    let fechaInicio = dayjs(inicio.$d);
                    let fechaFinal = dayjs(final.$d);
                    props.setDisplayAccesosUsuario(props.accesosUsuario.filter(acceso => {
                      return dayjs(acceso.fecha_hora_acceso).isBetween(fechaInicio, fechaFinal) && dayjs(acceso.fecha_hora_salida).isBetween(fechaInicio, fechaFinal);
                    }))
                  }
                  else {
                    setRangeAcceso({ de: null, hasta: null })
                    props.setDisplayAccesosUsuario(props.accesosUsuario);
                  }
                }}
              />
            </Form.Item>
            <Table
              className="mt-2"
              scroll={{ y: 600 }}
              rowKey={(acceso) => acceso.id_acceso + "T"}
              key="table"
              pagination={{ pageSize: 20, position: ["bottomCenter"] }}
              columns={columnaAcceso}
              locale={{
                emptyText: (
                  <Space direction="vertical" align="center">
                    <Empty description="No existen datos a mostrar..." />
                  </Space>
                ),
              }}
              dataSource={props.displayAccesosUsuario}
            />
          </Col>
          <Col span={24} lg={{ span: 12 }}>
            <Tooltip
              title="Generar PDF"
              placement={"right"}
              color={"#b51308"}
              key={"pdf"}
            >
              <Button
                className="center info-button"
                style={{ height: 50, width: 50, minWidth: 50 }}
                icon={
                  <FilePdfFilled
                    style={{
                      color: "#b51308",
                      fontSize: 30,
                    }}
                  />
                }
                onClick={() => {
                  notification.info({
                    message: "Generando PDF, por favor espere...",
                  });
                  pdf(
                    <accionesContext.Provider
                      value={{
                        acciones: props.accionesUsuario,
                        persona: props.persona,
                        rangeAcciones: rangeAcciones,
                      }}
                    >
                      <PdfAcciones />
                    </accionesContext.Provider>
                  )
                    .toBlob()
                    .then((blob) => {
                      const url = URL.createObjectURL(blob);
                      const link = document.createElement("a");
                      link.href = url;
                      let nombrePdf = `Acciones-${dayjs().year()}-${dayjs().month()}-${dayjs().date()}.pdf`;
                      link.setAttribute("download", nombrePdf);
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                      notification.success({
                        message: "PDF " + nombrePdf + " generado con éxito...",
                      });
                    });
                }}
              />
            </Tooltip>

            <Form.Item label="Filtrar por rango de fechas:">
              <RangePicker
                locale={{

                  lang: {
                    locale: "es_ES", // Cambia "es_ES" al código de idioma que prefieras
                    month: "Mes",
                    year: "Año",
                    ok: "Aceptar",
                    previousMonth: "Mes anterior",
                    dayFormat: "D",
                    previousYear: "Año anterior",
                    nextYear: "Año siguiente",
                    previousDecade: "Década anterior",
                    nextDecade: "Década siguiente",
                    previousCentury: "Siglo anterior",
                    nextCentury: "Siglo siguiente",
                    shortWeekDays: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"],
                    shortMonths: [
                      "Ene",
                      "Feb",
                      "Mar",
                      "Abr",
                      "May",
                      "Jun",
                      "Jul",
                      "Ago",
                      "Sep",
                      "Oct",
                      "Nov",
                      "Dic",
                    ],
                    dateFormat: "YYYY-MM-DD",
                    dateTimeFormat: "YYYY-MM-DD HH:mm:ss",
                    monthFormat: "MMMM YYYY",
                    today: "Hoy",
                    now: "Ahora",
                    backToToday: "Volver",
                    clear: "Limpiar",
                    dateSelect: "Seleccionar fecha",
                    timeSelect: "Seleccionar hora",
                    placeholder: "Seleccionar fecha y hora", // Agregado el placeholder,
                    nextMonth: "Mes siguiente",
                    decadeSelect: "Seleccionar década",
                    monthSelect: "Seleccionar mes",
                    yearFormat: "YYYY",
                    yearSelect: "Seleccione año"
                  },
                  timePickerLocale: {
                    placeholder: "Seleccionar hora",
                    rangePlaceholder: ["Hora de inicio", "Hora de fin"],
                  },
                  // Otras propiedades del objeto locale


                }}
                onChange={(value: any) => {
                  if (value) {
                    let [inicio, final] = value;
                    setRangeAcciones({ de: inicio.$d, hasta: final.$d })
                    let fechaInicio = dayjs(inicio.$d);
                    let fechaFinal = dayjs(final.$d);
                    props.setDisplayAccionesUsuario(props.accionesUsuario.filter(acceso => {
                      return dayjs(acceso.fecha_hora_accion).isBetween(fechaInicio, fechaFinal);
                    }))
                  }
                  else {
                    setRangeAcciones({ de: null, hasta: null })
                    props.setDisplayAccionesUsuario(props.accionesUsuario);
                  }
                }}
              />
            </Form.Item>
            <Table
              className="mt-2"
              scroll={{ y: 500 }}
              rowKey={(accion) => accion.id_accion + "T"}
              key="table"
              pagination={{ pageSize: 20, position: ["bottomCenter"] }}
              columns={columnaAcciones}
              locale={{
                emptyText: (
                  <Space direction="vertical" align="center">
                    <Empty description="No existen datos a mostrar..." />
                  </Space>
                ),
              }}
              dataSource={props.displayAccionesUsuario}
            />

          </Col>
        </Row>
      </Content>
    </>
  );
};

export default SeguimientoCuenta;
