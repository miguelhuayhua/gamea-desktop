"use client";
import {
  Button,
  Col,
  Empty,
  Form,
  Input,
  Row,
  Space,
  Spin,
  Switch,
  Tag,
  Tooltip,
  message,
  notification,
} from "antd";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import Table, { ColumnsType } from "antd/es/table";
import {
  EditOutlined,
  FilterOutlined,
  FileExcelFilled,
  FilePdfFilled,
  LoadingOutlined,
} from "@ant-design/icons";

import dayjs from "dayjs";
import isBeetwen from "dayjs/plugin/isBetween";
import { Hijo, dataHijo } from "./data";
import HijoModal from "./hijo";
import { Adulto, dataAdulto } from "../adultos/data";
import { AiOutlineReload } from "react-icons/ai";
import { pdf } from "@react-pdf/renderer";
import { Persona, dataPersona } from "../personal/data";
import PdfHijos from "./pdf-listado";
import dynamic from "next/dynamic";
const Paragraph = dynamic(async () => await import("antd/es/typography/Paragraph"), {
  ssr: false,
});  import { Usuario, dataUsuario } from "../usuarios/data";
export const context2 = createContext({});
//ROUTING

const Informacion = () => {
  dayjs.extend(isBeetwen);
  //estados
  const [loaded, setLoaded] = useState(false);
  const [adulto, setAdulto] = useState<Adulto>(dataAdulto);
  const [open, setOpen] = useState(false);

  const columns: ColumnsType<Hijo> = [
    {
      title: "ID Hijo",
      dataIndex: "id_hijo",
      key: "id_hijo",
      className: "text-center",
      fixed: "left",
      width: 120,
      render(_, hijo) {
        return (
          <Paragraph className="center" copyable={{ tooltips: "Copiar", onCopy: () => message.success({ content: "Copiado exitosamente" }) }}>
            {hijo.id_hijo}
          </Paragraph>
        );
      },
    },
    {
      title: "Nombres y Apellidos",

      key: "accion_realizada",
      render: (_, hijo) => {
        return hijo.nombres_apellidos;
      },
      className: "text-center",
    },

    {
      title: "Estado",
      key: "estado",
      dataIndex: "estado",
      className: "text-center",
      width: 120,
      render: (_, hijo) =>
        hijo.estado == 1 ? (
          <Tag key={_} color="green">
            Activo
          </Tag>
        ) : (
          <Tag key={_} color="red">
            Cerrado
          </Tag>
        ),
    },
    {
      title: "Acción",
      key: "accion",
      className: "text-center",
      fixed: "right",
      width: 150,
      render: (_, hijo) => (
        <div
          key={hijo.id_hijo + "d"}
          className="d-flex align-items-center justify-content-around"
        >
          <Button
            key={hijo.id_hijo}
            style={{
              fontSize: 20,
              width: 40,
              height: 40,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 0,
            }}
          >
            <EditOutlined style={{ zIndex: 0 }} />
          </Button>
          {persona.cargo == "1" ? (
            <Switch key={hijo.id_hijo + "-"} checked={hijo.estado == 1} />
          ) : null}
        </div>
      ),
    },
  ];
  const [hijos, setHijos] = useState<Hijo[]>([]);
  const [displayHijos, setDisplayHijos] = useState<Hijo[]>([]);
  const [hijo, setHijo] = useState<Hijo>(dataHijo);
  const [persona, setPersona] = useState<Persona>(dataPersona);

  //cargado de datos desde la API
    const [usuario, setUsuario] = useState<Usuario>(dataUsuario);
  useEffect(() => {
    let id_persona = localStorage.getItem('id_persona');
    let id_usuario = localStorage.getItem('id_usuario');
    if (id_persona && id_usuario) {
      axios.post<Usuario>(process.env.BACKEND_URL + "/usuario/get", { id_usuario: id_usuario }).then(res => {
        setUsuario(res.data);
      });
      axios.post<Persona>(process.env.BACKEND_URL + "/persona/get", { id_persona: id_persona }).then(res => {
        setPersona(res.data);
      });
      axios.get<Hijo[]>(process.env.BACKEND_URL + "/hijo/all").then((res) => {
        if (persona.cargo == "1") {
          setHijos(res.data);
          setDisplayHijos(res.data);
        } else {
          let hijosFilter = res.data.filter((value) => {
            return value.estado == 1;
          });
          setHijos(hijosFilter);
          setDisplayHijos(hijosFilter);
        }
      });
    }
  }, []);


  //cargado de datos desde la API

  return (
    <>
      <Row>
        <Col span={24} lg={{ span: 10 }}>
          <h5 className="mt-4">
            {' Filtros para "Hijos"'} <FilterOutlined />
          </h5>
          <small style={{ color: "#999" }}>
            Cada filtro realiza búsquedas por separado...
          </small>
        </Col>
        <Col
          span={24}
          offset={0}
          lg={{ span: 8, offset: 6 }}
          className="center"
        >
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
                  <context2.Provider
                    value={{
                      hijos: displayHijos,
                      persona: persona,
                    }}
                  >
                    <PdfHijos />
                  </context2.Provider>
                )
                  .toBlob()
                  .then((blob) => {
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement("a");
                    link.href = url;
                    let nombrePdf = `Hijos-${dayjs().year()}-${dayjs().month()}-${dayjs().date()}.pdf`;
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

          <Tooltip
            title="Generar EXCEL"
            placement={"right"}
            color={"#107840"}
            key={"excel"}
          >
            <Button
              className="center info-button"
              style={{ height: 50, width: 50, minWidth: 50 }}
              onClick={() => {
                notification.info({
                  message: (
                    <div>
                      Generando Excel...
                      <Spin
                        indicator={
                          <LoadingOutlined
                            style={{ marginLeft: 10, fontSize: 24 }}
                          />
                        }
                      />
                    </div>
                  ),
                });
                axios
                  .get(process.env.BACKEND_URL + "/hijo/report", {
                    responseType: "blob",
                  })
                  .then((res) => {
                    const url = URL.createObjectURL(res.data);
                    const link = document.createElement("a");
                    link.href = url;
                    link.setAttribute(
                      "download",
                      "Hijos-" + dayjs().format("DD-MM-YYYY_HH:mm:ss") + ".xlsx"
                    );
                    link.click();
                    link.remove();
                    notification.success({
                      message: (
                        <p style={{ fontSize: 14 }}>
                          {"¡Excel: Hijos-" +
                            dayjs().format("DD-MM-YYYY_HH:mm:ss") +
                            ".xlsx, generado con éxito!"}
                        </p>
                      ),
                    });
                  });
              }}
              icon={
                <FileExcelFilled
                  style={{
                    color: "#107840",
                    fontSize: 30,
                  }}
                />
              }
            />
          </Tooltip>
          <Button
            className="info-button"
            type="primary"
            style={{ height: 50, width: 50 }}
            onClick={() => {
              axios
                .get<Hijo[]>(process.env.BACKEND_URL + "/hijo/all")
                .then((res) => {
                  setHijos(res.data);
                  setDisplayHijos(res.data);
                  message.info("Datos actualizados...");
                });
            }}
          >
            <AiOutlineReload fontSize={20} />
          </Button>
        </Col>
      </Row>
      <Form layout={"horizontal"} style={{ marginTop: 10 }}>
        <Row gutter={[12, 0]}>
          <Col span={24} lg={{ span: 12 }}>
            <Form.Item label="ID Hijo: ">
              <Input
                placeholder="Introduzca el ID del hijo"
                onChange={(ev) => {
                  setDisplayHijos(
                    hijos.filter((value) => {
                      return value.id_hijo.includes(
                        ev.target.value.toUpperCase()
                      );
                    })
                  );
                }}
              />
            </Form.Item>
          </Col>

          <Col span={24} lg={{ span: 12 }}>
            <Form.Item label="Nombres o apellidos:">
              <Input
                placeholder="Introduzca el nombre del hijo..."
                onChange={(ev) => {
                  setDisplayHijos(
                    hijos.filter((value) => {
                      return value.nombres_apellidos
                        .toLowerCase()
                        .includes(ev.target.value.toLowerCase());
                    })
                  );
                }}
              ></Input>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <hr />
      <Table
        className="mt-2"
        scroll={{ x: 800, y: 500 }}
        rowKey={(hijo) => hijo.id_hijo + "T"}
        key="table"
        pagination={{ pageSize: 20, position: ["bottomCenter"] }}
        columns={columns}
        locale={{
          emptyText: (
            <Space direction="vertical" align="center">
              <Empty description="No existen datos a mostrar..." />
            </Space>
          ),
        }}
        dataSource={displayHijos}
        onRow={(value, index) => {
          return {
            onClick: (ev: any) => {
              try {
                if (ev.target.className.includes("switch")) {
                  axios
                    .post(process.env.BACKEND_URL + "/hijo/estado", {
                      id_hijo: value.id_hijo, usuario: usuario
                    })
                    .then((res) => {
                      message.success("¡Caso cambiado con éxito!");
                      axios
                        .get<Hijo[]>(process.env.BACKEND_URL + "/hijo/all")
                        .then((res) => {
                          setHijos(res.data);
                          setDisplayHijos(res.data);
                        });
                    });
                } else if (ev.target.className.includes("ant-btn")) {
                  setOpen(true);
                  axios
                    .post(process.env.BACKEND_URL + "/hijo/get", {
                      id_hijo: value.id_hijo,
                    })
                    .then((res) => {
                      setHijo(res.data);
                      axios
                        .post<{ adulto: Adulto; hijos: Hijo[] }>(
                          process.env.BACKEND_URL + "/adulto/get",
                          {
                            id_adulto: value.id_adulto,
                          }
                        )
                        .then((res) => {
                          setAdulto({
                            ...res.data.adulto,
                            hijos: res.data.hijos,
                          });
                          setLoaded(true);
                        });
                    });
                }
              } catch (error) {
                setOpen(true);
                axios
                  .post(process.env.BACKEND_URL + "/hijo/get", {
                    id_hijo: value.id_hijo,
                  })
                  .then((res) => {
                    setHijo(res.data);
                    axios
                      .post<{ adulto: Adulto; hijos: Hijo[] }>(
                        process.env.BACKEND_URL + "/adulto/get",
                        {
                          id_adulto: value.id_adulto,
                        }
                      )
                      .then((res) => {
                        setAdulto({
                          ...res.data.adulto,
                          hijos: res.data.hijos,
                        });
                        setLoaded(true);
                      });
                  });
              }
            },
          };
        }}
      />

      <HijoModal
        hijo={hijo}
        loaded={loaded}
        adulto={adulto}
        setDisplayHijos={setDisplayHijos}
        setHijo={setHijo}
        setHijos={setHijos}
        key="hijomodal"
        open={open}
        usuario={usuario}
        setOpen={setOpen}
      ></HijoModal>
    </>
  );
};
export default Informacion;
