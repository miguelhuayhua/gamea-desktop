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

import { createContext, useEffect, useState } from "react";
import axios from "axios";
import Table, { ColumnsType } from "antd/es/table";

import {
  EditOutlined,
  FilterOutlined,
  FileExcelFilled,
  FilePdfFilled,
  LoadingOutlined,
} from "@ant-design/icons";
import AdultoModal from "./adulto";

import dayjs from "dayjs";
import isBeetwen from "dayjs/plugin/isBetween";
import { Adulto, Domicilio, dataAdulto, dataDomicilio } from "./data";
import { Hijo } from "../hijos/data";
import { AiOutlineReload } from "react-icons/ai";
import { pdf } from "@react-pdf/renderer";
import PdfAdultos from "./pdf-listado";
import { Persona, dataPersona } from "../personal/data";
import dynamic from "next/dynamic";
const Paragraph = dynamic(async () => await import("antd/es/typography/Paragraph"), {
  ssr: false,
});
import { Usuario, dataUsuario } from "../usuarios/data";
export const context1 = createContext({});

const Informacion = () => {
  dayjs.extend(isBeetwen);
  const [domicilios, setDomicilios] = useState<Domicilio[]>([]);

  const [loaded, setLoaded] = useState(false);
  //estados
  const [open, setOpen] = useState(false);
  const [adulto, setAdulto] = useState<Adulto>(dataAdulto);
  const [domicilio, setDomicilio] = useState<Domicilio>(dataDomicilio);
  const columns: ColumnsType<Adulto> = [
    {
      title: "ID Adulto",
      dataIndex: "id_adulto",
      key: "id_adulto",
      className: "text-center",
      fixed: "left",
      sortDirections: ["ascend", "descend"],
      width: 130,
      sorter: (a, b) => {
        let id1 = Number.parseInt(a.id_adulto.split("-")[1]);
        let id2 = Number.parseInt(b.id_adulto.split("-")[1]);
        return id1 - id2;
      },
      render(_, adulto) {
        return (
          <Paragraph className="center" copyable>
            {adulto.id_adulto}
          </Paragraph>
        );
      },
    },
    {
      title: "Nombres y Apellidos",

      key: "accion_realizada",
      render: (_, adulto) => {
        return adulto.nombre + " " + adulto.paterno + " " + adulto.materno;
      },
      className: "text-center",
    },

    {
      title: "Estado",
      key: "estado",
      dataIndex: "estado",
      className: "text-center",
      render: (_, adulto) =>
        adulto.estado == 1 ? (
          <Tag key={_} color="green">
            Activo
          </Tag>
        ) : (
          <Tag key={_} color="red">
            Inactivo
          </Tag>
        ),
    },
    {
      title: "Acción",
      key: "accion",
      className: "text-center",
      fixed: "right",
      width: 150,
      render: (_, adulto) => (
        <div
          key={adulto.id_adulto + "d"}
          className="d-flex align-items-center justify-content-around"
        >
          {adulto.estado != 1 ? null : (
            <Button
              key={adulto.id_adulto}
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
          )}
          {persona.cargo == "1" ? (
            <>
              <Switch
                key={adulto.id_adulto + "-"}
                checked={adulto.estado == 1}
              />
            </>
          ) : null}
        </div>
      ),
    },
  ];
  const [adultos, setAdultos] = useState<Adulto[]>([]);
  const [displayAdultos, setDisplayAdultos] = useState<Adulto[]>([]);
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
      axios
        .get<Adulto[]>(process.env.BACKEND_URL + "/adulto/all")
        .then((res) => {
          setAdultos(res.data);
          setDisplayAdultos(res.data);
        });
    }
  }, []);


  return (
    <>
      <Row>
        <Col span={24} lg={{ span: 10 }}>
          <h5 className="mt-4">
            {' Filtros para "Adultos"'} <FilterOutlined />
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
                  <context1.Provider
                    value={{
                      adultos: displayAdultos,
                      persona: persona,
                    }}
                  >
                    <PdfAdultos />
                  </context1.Provider>
                )
                  .toBlob()
                  .then((blob) => {
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement("a");
                    link.href = url;
                    let nombrePdf = `Adultos-${dayjs().year()}-${dayjs().month()}-${dayjs().date()}.pdf`;
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
                  .get(process.env.BACKEND_URL + "/adulto/report", {
                    responseType: "blob",
                  })
                  .then((res) => {
                    const url = URL.createObjectURL(res.data);
                    const link = document.createElement("a");
                    link.href = url;
                    link.setAttribute(
                      "download",
                      "Adultos-" +
                      dayjs().format("DD-MM-YYYY_HH:mm:ss") +
                      ".xlsx"
                    );
                    link.click();
                    link.remove();
                    notification.success({
                      message: (
                        <p style={{ fontSize: 14 }}>
                          {"¡Excel: Adultos-" +
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
                .get<Adulto[]>(process.env.BACKEND_URL + "/adulto/all")
                .then((res) => {
                  setAdultos(res.data);
                  setDisplayAdultos(res.data);
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
          <Col span={24} md={{ span: 24 }} xl={{ span: 8 }}>
            <Form.Item label="ID del adulto: ">
              <Input
                placeholder="Introduzca el ID del adulto"
                onChange={(value) => {
                  setDisplayAdultos(
                    adultos.filter((adulto) => {
                      return adulto.id_adulto.includes(value.target.value);
                    })
                  );
                }}
              />
            </Form.Item>
          </Col>
          <Col span={24} lg={{ span: 8 }}>
            <Form.Item label="Nombres o Apellidos: ">
              <Input
                placeholder="Buscar por nombres o apellidos"
                onChange={(value) => {
                  setDisplayAdultos(
                    adultos.filter((adulto) => {
                      return (adulto.nombre + adulto.paterno + adulto.materno)
                        .toLocaleLowerCase()
                        .includes(value.target.value.toLocaleLowerCase());
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
        rowKey={(adulto) => adulto.id_adulto + "T"}
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
        dataSource={displayAdultos}
        onRow={(value, index) => {
          return {
            onClick: (ev: any) => {
              try {
                if (ev.target.className.includes("switch")) {
                  axios
                    .post(process.env.BACKEND_URL + "/adulto/estado", {
                      id_adulto: value.id_adulto,
                      usuario: usuario
                    })
                    .then((res) => {
                      value.estado == 0
                        ? message.success(
                          "Adulto " + value.id_adulto + " activo"
                        )
                        : message.error(
                          "Adulto " + value.id_adulto + " inactivo"
                        );

                      axios
                        .get<Adulto[]>(process.env.BACKEND_URL + "/adulto/all")
                        .then((res) => {
                          setAdultos(res.data);
                          setDisplayAdultos(res.data);
                        });
                    });
                } else if (ev.target.className.includes("ant-btn")) {
                  setOpen(true);
                  axios
                    .post<Domicilio[]>(
                      process.env.BACKEND_URL + "/domicilio/getByIdAdulto",
                      {
                        id_adulto: value.id_adulto,
                      }
                    )
                    .then((res) => {
                      setDomicilios(res.data);
                    });
                  axios
                    .post<Domicilio>(
                      process.env.BACKEND_URL + "/domicilio/get",
                      {
                        id_adulto: value.id_adulto,
                      }
                    )
                    .then((res) => {
                      setDomicilio(res.data);
                    });
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
                }
              } catch (error) {
                setOpen(true);
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
                    axios
                      .post<Domicilio[]>(
                        process.env.BACKEND_URL + "/domicilio/getByIdAdulto",
                        {
                          id_adulto: value.id_adulto,
                        }
                      )
                      .then((res) => {
                        setDomicilios(res.data);
                      });
                    axios
                      .post<Domicilio>(
                        process.env.BACKEND_URL + "/domicilio/get",
                        {
                          id_adulto: value.id_adulto,
                        }
                      )
                      .then((res) => {
                        setDomicilio(res.data);
                        setLoaded(true);
                      });
                  });
              }
            },
          };
        }}
      />
      <AdultoModal
        domicilios={domicilios}
        loaded={loaded}
        setLoaded={setLoaded}
        key="adultomodal"
        domicilio={domicilio}
        setDomicilio={setDomicilio}
        open={open}
        setOpen={setOpen}
        adulto={adulto}
        setAdulto={setAdulto}
        setAdultos={setAdultos}
        setDisplayAdultos={setDisplayAdultos}
        setDomicilios={setDomicilios}
        usuario={usuario}
      ></AdultoModal>
    </>
  );
};
export default Informacion;
