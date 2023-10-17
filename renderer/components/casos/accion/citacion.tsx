;
import { PDFViewer, pdf } from "@react-pdf/renderer";
import { UserOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Drawer,
  Form,
  List,
  Popconfirm,
  Row,
  notification,
  DatePicker,
  TimePicker,
  Input,
  Avatar,
  Switch,
  message,
  Space,
  Card,
  Tag,
} from "antd";
import { NextPage } from "next";
import { Adulto } from "../../adultos/data";
import { Caso, Citacion, dataCitacion } from "../data";
import { Persona } from "../../personal/data";
import { createContext, useEffect, useState } from "react";
import { PiListMagnifyingGlassFill } from "react-icons/pi";
import Formulariocitacion from "./pdf-citacion";
import axios from "axios";
import { AiOutlineFilePdf } from "react-icons/ai";
import dayjs, { Dayjs } from "dayjs";
import { Citado, dias, meses, nro_citacion } from "../nuevocaso/data";
import moment, { now } from "moment";

import ModalAudienciaSuspendida from "./audiencia";
import { Usuario } from "../../usuarios/data";
import { useRouter } from "next/router";
export const DataContext2 = createContext({});

interface Props {
  caso: Caso;
  adulto: Adulto;
  persona: Persona;
  citaciones: Citacion[];
  citacion: { citacion: Citacion; size: number };
  setCitacion: any;
  setCitaciones: any;
  usuario: Usuario;
}

const CitacionOptions: NextPage<Props> = (props) => {
  const [open, setOpen] = useState(false);
  const [citado, setCitado] = useState("");
  const [open2, setOpen2] = useState(false);
  const [citacion, setCitacion] = useState<Citacion>(dataCitacion);
  const [citados, setCitados] = useState<any[]>([]);
  //cambio del estado de caso
  const [citados2, setCitados2] = useState<any[]>([]);

  const router = useRouter();
  useEffect(() => {
    setCitados([
      ...props.adulto.hijos.map((value) => {
        return { ...value, citado: 1 };
      }),
    ]);
  }, []);

  return (
    <>
      <Row gutter={[24, 24]}>
        <Col span={24} xl={{ span: 14 }}>
          <div className="detalle-citacion">
            <p>
              <b style={{ marginRight: 10 }}>Adulto mayor implicado: </b>
              {props.adulto.nombre +
                " " +
                props.adulto.paterno +
                " " +
                props.adulto.materno}
              <br />
              <b style={{ marginRight: 5 }}>Fecha: </b>
              {dayjs().date() +
                " de " +
                meses[dayjs().month()] +
                " del " +
                dayjs().year()}
            </p>
          </div>
          {props.citacion.size < 4 ? (
            <Form>
              <h6 style={{ textAlign: "center", margin: "20px 0" }}>
                {nro_citacion[props.citaciones.length]} Citación
              </h6>
              <Row gutter={[24, 12]}>
                <Col span={24} lg={{ span: 12 }}>
                  <Form.Item label={"Fecha de Registro"}>
                    <DatePicker
                      style={{ width: "100%" }}
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
                      disabledDate={(date) => {
                        return (
                          moment().add(-1, "day") >= date || date.day() == 0
                        );
                      }}
                      defaultValue={dayjs()}
                      onChange={(ev) => {
                        let fecha = ev as Dayjs;
                        props.setCitacion({
                          ...props.citacion,
                          citacion: {
                            ...props.citacion.citacion,
                            fecha_citacion: fecha.format("YYYY-MM-DD"),
                          },
                        });
                      }}
                    ></DatePicker>
                  </Form.Item>
                </Col>
                <Col span={24} lg={{ span: 12 }}>
                  <Form.Item label="Hora de registro:">
                    <TimePicker
                      style={{ width: "100%" }}
                      defaultValue={dayjs(now())}
                      onChange={(ev) => {
                        let fecha = ev as Dayjs;
                        props.setCitacion({
                          ...props.citacion,
                          citacion: {
                            ...props.citacion.citacion,
                            hora_citacion: fecha.format("HH:mm:ss"),
                          },
                        });
                      }}
                    />
                  </Form.Item>
                </Col>

                <Col span={24}>
                  <hr />
                  <List
                    className="demo-loadmore-list"
                    locale={{
                      emptyText: (
                        <>
                          <PiListMagnifyingGlassFill
                            width={50}
                            height={50}
                            fontSize={50}
                          />
                          <p className="text-center">Sin datos</p>
                        </>
                      ),
                    }}
                    header={
                      <div

                      >
                        <h6 className="text-center">
                          <b>Lista de citados</b>
                        </h6>
                        <Space.Compact>
                          <Form.Item label="Agregar Citado">
                            <Input
                              onChange={(ev) => {
                                setCitado(ev.target.value);
                              }}
                              value={citado}
                              allowClear
                            />
                          </Form.Item>
                          <Button
                            type="default"
                            onClick={() => {
                              axios
                                .post<{ genero: number }>(
                                  process.env.BACKEND_URL +
                                  "/ml/genderize/predict",
                                  { nombres_apellidos: citado }
                                )
                                .then((res) => {
                                  let genero =
                                    res.data.genero == 1
                                      ? "Femenino"
                                      : "Masculino";
                                  setCitados([
                                    ...citados,
                                    {
                                      nombres_apellidos: citado,
                                      citado: 1,
                                      genero,
                                    },
                                  ]);
                                  message.info("Citado agregado...");
                                  setCitado("");
                                });
                            }}
                          >
                            Insertar
                          </Button>
                        </Space.Compact>
                      </div>
                    }
                    itemLayout="horizontal"
                    dataSource={citados}
                    rowKey={(item) => item.nombres_apellidos}
                    renderItem={(item: any, index) => (
                      <List.Item
                        actions={[
                          <Switch
                            key={index + "s"}
                            checked={item.citado == 1}
                            checkedChildren="Citar"
                            unCheckedChildren="No citar"
                            onChange={(ev) => {
                              setCitados(
                                citados.map((value) => {
                                  if (
                                    value.nombres_apellidos ==
                                    item.nombres_apellidos
                                  ) {
                                    value.citado = !value.citado;
                                  }
                                  return value;
                                })
                              );
                            }}
                          ></Switch>,
                        ]}
                      >
                        <List.Item.Meta
                          avatar={
                            <Avatar
                              style={{
                                backgroundColor:
                                  item.genero == "Femenino"
                                    ? "#ff0080"
                                    : "#0041c8",
                                color: "white",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                              icon={<UserOutlined />}
                            />
                          }
                          title={item.nombres_apellidos}
                        />
                      </List.Item>
                    )}
                  />
                </Col>

                <Col span={24}>
                  <Popconfirm
                    key="popconfirm"
                    title="¿Estás seguro de continuar?"
                    onConfirm={() => {
                      notification.info({
                        message: "Guardando y generando...",
                      });
                      axios
                        .post(process.env.BACKEND_URL + "/caso/citacion/add", {
                          id_caso: props.caso.id_caso,
                          citacion: props.citacion.citacion,
                          citados: citados,
                          numero: props.citacion.size,
                          usuario: props.usuario
                        })
                        .then((res) => {
                          if (res.data.status == 1) {
                            pdf(
                              <DataContext2.Provider
                                value={{
                                  adulto: props.adulto,
                                  caso: props.caso,
                                  persona: props.persona,
                                  nro_citacion:
                                    nro_citacion[props.citacion.size],
                                  citados: citados,
                                  citacion: props.citacion.citacion,
                                }}
                              >
                                <Formulariocitacion />
                              </DataContext2.Provider>
                            )
                              .toBlob()
                              .then((blob) => {
                                notification.success({
                                  message: "¡Guardado y generado con éxito!",
                                });
                                axios
                                  .post<Citacion[]>(
                                    process.env.BACKEND_URL +
                                    "/caso/citacion/all",
                                    {
                                      id_caso: router.query.id_caso
                                    }
                                  )
                                  .then((res) => {
                                    props.setCitaciones(res.data);
                                    props.setCitacion({
                                      ...props.citacion,
                                      size: res.data.length,
                                    });
                                  });
                                setCitados([
                                  ...props.adulto.hijos.map((value) => {
                                    return { ...value, citado: 1 };
                                  }),
                                ]);
                                const url = URL.createObjectURL(blob);
                                const link = document.createElement("a");
                                link.href = url;
                                let { nombre, paterno, materno } = props.adulto;

                                link.setAttribute(
                                  "download",
                                  nombre + paterno + materno + ".pdf"
                                );
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                              });
                          }
                        });
                    }}
                    okText="Sí"
                    cancelText="No"
                  >
                    <Button type="primary" style={{ marginTop: 20 }}>
                      Guardar y generar {nro_citacion[props.citaciones.length]}{" "}
                      Citación
                    </Button>
                  </Popconfirm>
                  <Button
                    style={{ marginTop: 20, marginLeft: 20 }}
                    onClick={() => {
                      setOpen(true);
                    }}
                  >
                    Vista Previa PDF
                  </Button>
                </Col>
              </Row>
            </Form>
          ) : (
            <h3>Límite de citaciones excedida...</h3>
          )}
        </Col>
        <Col span={24} xl={{ span: 10 }}>
          <hr />
          <List
            header={<b>Historial de citaciones</b>}
            locale={{
              emptyText: (
                <>
                  <PiListMagnifyingGlassFill
                    width={50}
                    height={50}
                    fontSize={50}
                  />
                  <p>Sin historial de citaciones...</p>
                </>
              ),
            }}
            dataSource={props.citaciones}
            rowKey={(citacion) => citacion.id_citacion}
            renderItem={(item, index) => {
              let diasCitacion = dayjs(item.fecha_citacion).diff(
                dayjs(),
                "days"
              );
              return (
                <List.Item>
                  <>
                    <Card
                      style={{ width: "100%" }}
                      bordered={false}
                      title={
                        <>
                          <span className="number">{item.numero + 1}</span>
                          <b>{nro_citacion[item.numero]} Citación</b>
                          {item.suspendido == 1 ? (
                            <Tag color="#f50">Suspendido</Tag>
                          ) : diasCitacion < 0 ? (
                            <Tag color="#cd201f">Citación Atrasada</Tag>
                          ) : diasCitacion == 0 ? (
                            <Tag color="#87d068">Hoy</Tag>
                          ) : (
                            <Tag color="#108ee9">En {diasCitacion} días</Tag>
                          )}
                        </>
                      }
                    >
                      <Row>
                        <Col span={8}>
                          <p style={{ fontSize: 10, paddingRight: 20 }}>
                            <b>
                              Fecha y hora de citación:{" "}
                              {item.fecha_citacion + " " + item.hora_citacion}
                            </b>
                            <br />
                            <b>Creado el: </b>
                            {item.fecha_creacion}
                          </p>
                        </Col>
                        {item.suspendido == 1 ? (
                          <Col span={16}></Col>
                        ) : (
                          <>
                            <Col span={8}>
                              <Button
                                onClick={() => {
                                  axios
                                    .post<Citado[]>(
                                      process.env.BACKEND_URL +
                                      "/caso/citados/get",
                                      {
                                        id_citacion: item.id_citacion,
                                      }
                                    )
                                    .then((res) => {
                                      let citados: Citado[] = res.data.map(
                                        (value) => {
                                          return { ...value, citado: 1 };
                                        }
                                      );
                                      pdf(
                                        <DataContext2.Provider
                                          value={{
                                            adulto: props.adulto,
                                            caso: props.caso,
                                            nro_citacion:
                                              nro_citacion[item.numero],
                                            citacion: item,
                                            persona: props.persona,
                                            citados: citados,
                                          }}
                                        >
                                          <Formulariocitacion />
                                        </DataContext2.Provider>
                                      )
                                        .toBlob()
                                        .then((blob) => {
                                          const url = URL.createObjectURL(blob);
                                          const link =
                                            document.createElement("a");
                                          link.href = url;
                                          let { nombre, paterno, materno } =
                                            props.adulto;

                                          link.setAttribute(
                                            "download",
                                            nombre + paterno + materno + ".pdf"
                                          );
                                          document.body.appendChild(link);
                                          link.click();
                                          document.body.removeChild(link);
                                        });
                                    });
                                }}
                                style={{ height: 45, margin: "0 auto" }}
                              >
                                Generar
                                <AiOutlineFilePdf
                                  style={{
                                    color: "#b51308",
                                    fontSize: 25,
                                  }}
                                />
                              </Button>
                            </Col>
                            <Col span={8}>
                              <Button
                                onClick={() => {
                                  setOpen2(true);
                                  setCitacion(item);
                                  axios
                                    .post<Citado[]>(
                                      process.env.BACKEND_URL +
                                      "/caso/citados/get",
                                      {
                                        id_citacion: item.id_citacion,
                                      }
                                    )
                                    .then((res) => {
                                      setCitados2(res.data);
                                    });
                                }}
                                style={{ marginLeft: 10, height: 45 }}
                              >
                                Suspender
                              </Button>
                            </Col>
                          </>
                        )}
                      </Row>
                    </Card>
                  </>
                </List.Item>
              );
            }}
          ></List>
        </Col>
      </Row>
      <Drawer
        title={`Vista previa del Documento`}
        placement="right"
        size={"large"}
        onClose={() => {
          setOpen(false);
        }}
        open={open}
      >
        <PDFViewer showToolbar={false} style={{ width: "100%", height: 800 }}>
          <DataContext2.Provider
            value={{
              persona: props.persona,
              adulto: props.adulto,
              caso: props.caso,
              nro_citacion: nro_citacion[props.citacion.size],
              citacion: props.citacion.citacion,
              citados: citados,
            }}
          >
            <Formulariocitacion />
          </DataContext2.Provider>
        </PDFViewer>
      </Drawer>

      <ModalAudienciaSuspendida
        citados={citados2}
        adulto={props.adulto}
        caso={props.caso}
        citacion={citacion}
        open2={open2}
        setOpen2={setOpen2}
        persona={props.persona}
        usuario={props.usuario}
      ></ModalAudienciaSuspendida>
    </>
  );
};

export default CitacionOptions;
