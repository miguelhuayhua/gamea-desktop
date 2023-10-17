"use client";
import {
  Button,
  Col,
  DatePicker,
  Empty,
  FloatButton,
  Form,
  Input,
  Row,
  Segmented,
  Space,
  Spin,
  Switch,
  Tag,
  Tooltip,
  message,
  notification,
} from "antd";
import { AiOutlineReload, AiOutlineUserAdd } from "react-icons/ai";
import { createContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import Table, { ColumnsType } from "antd/es/table";
import {
  EditOutlined,
  FilterOutlined,
  FileExcelFilled,
  FilePdfFilled,
  LoadingOutlined,
} from "@ant-design/icons";

import { Persona, dataPersona } from "./data";
import PersonaModal from "./personal";
import dayjs from "dayjs";
import Link from "next/link";
import { pdf } from "@react-pdf/renderer";
import PdfPersonal from "./pdf-listado";
import dynamic from "next/dynamic";
const Paragraph = dynamic(async () => await import("antd/es/typography/Paragraph"), {
  ssr: false,
});  import { Usuario, dataUsuario } from "../usuarios/data";
export const context4 = createContext({});
const Informacion = () => {
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [persona, setPersona] = useState<Persona>(dataPersona);
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [displayPersonas, setDisplayPersonas] = useState<Persona[]>([]);

  //COLUMNAS
  const columns: ColumnsType<Persona> = [
    {
      title: "ID Persona",
      dataIndex: "id_persona",
      key: "id_persona",
      className: "text-center",
      fixed: "left",
      width: 120,
      render: (_, persona) => {
        return (
          <Paragraph className="center" copyable>
            {persona.id_persona}
          </Paragraph>
        );
      },
    },

    {
      title: "C.I.",
      key: "ci",
      render: (_, persona) => {
        return (
          <Paragraph className="center" copyable>
            {persona.ci}
          </Paragraph>
        );
      },
      className: "text-center",
    },

    {
      title: "Persona",
      key: "Persona",
      render: (_, persona) => {
        return `${persona.profesion} ${persona.nombres} ${persona.paterno} ${persona.materno}`;
      },
      className: "text-center",
    },

    {
      title: "Estado",
      key: "estado",
      dataIndex: "estado",
      className: "text-center",
      render: (_, persona) =>
        persona.estado == 1 ? (
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
      width: 150,
      className: "text-center",
      fixed: "right",
      render: (_, persona) => (
        <div
          key={persona.id_persona + "d"}
          className="d-flex align-items-center justify-content-around"
        >
          <Button
            key={persona.id_persona}
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
          <Switch
            key={persona.id_persona + "-"}
            checked={persona.estado == 1}
          />
        </div>
      ),
    },
  ];

  //cargado de datos desde la API

  const [persona1, setPersona1] = useState<Persona>(dataPersona);
  const [usuario, setUsuario] = useState<Usuario>(dataUsuario);
  //cargado de datos desde la API
  useEffect(() => {
    let id_persona = localStorage.getItem('id_persona');
    let id_usuario = localStorage.getItem('id_usuario');
    if (id_persona && id_usuario) {
      axios.post<Usuario>(process.env.BACKEND_URL + "/usuario/get", { id_usuario: id_usuario }).then(res => {
        setUsuario(res.data);
      });
      axios.post<Persona>(process.env.BACKEND_URL + "/persona/get", { id_persona: id_persona }).then(res => {
        setPersona1(res.data);
      });
      axios
        .get<Persona[]>(process.env.BACKEND_URL + "/persona/all")
        .then((res) => {
          setPersonas(res.data);
          setDisplayPersonas(
            res.data.filter((value) => {
              return value.id_persona != persona.id_persona;
            })
          );
        });
    }
  }, []);


  return (
    <>
      <Row>
        <Col span={24} lg={{ span: 10 }}>
          <h5 className="mt-4">
            {' Filtros para "Personal"'} <FilterOutlined />
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
          <Link
            href="/dashboard/personal/agregar"
            style={{ textDecoration: "none" }}
          >
            <Button
              className="center info-button"
              icon={<AiOutlineUserAdd />}
              title="Agregar Personal"
              style={{ height: 50 }}
            >
              Agregar Personal
            </Button>
          </Link>
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
                  <context4.Provider
                    value={{
                      personas: displayPersonas,
                      persona: persona1,
                    }}
                  >
                    <PdfPersonal />
                  </context4.Provider>
                )
                  .toBlob()
                  .then((blob) => {
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement("a");
                    link.href = url;
                    let nombrePdf = `Personal-${dayjs().year()}-${dayjs().month()}-${dayjs().date()}.pdf`;
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
                  .get(process.env.BACKEND_URL + "/persona/report", {
                    responseType: "blob",
                  })
                  .then((res) => {
                    const url = URL.createObjectURL(res.data);
                    const link = document.createElement("a");
                    link.href = url;
                    link.setAttribute(
                      "download",
                      "Personal-" +
                      dayjs().format("DD-MM-YYYY_HH:mm:ss") +
                      ".xlsx"
                    );
                    link.click();
                    link.remove();
                    notification.success({
                      message: (
                        <p style={{ fontSize: 14 }}>
                          {"¡Excel: Personal-" +
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
                .get<Persona[]>(process.env.BACKEND_URL + "/persona/all")
                .then((res) => {
                  setPersonas(res.data);
                  setDisplayPersonas(
                    res.data.filter((value) => {
                      return value.id_persona != persona1.id_persona;
                    })
                  );
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
            <Form.Item label="ID de persona: ">
              <Input
                onChange={(ev) => {
                  if (ev.target.value == '') {
                    setDisplayPersonas(personas.filter(value => value.id_persona != usuario.id_persona));
                  }
                  else {
                    setDisplayPersonas(
                      personas.filter((persona) => {
                        return persona.id_persona
                          .toLocaleLowerCase()
                          .includes(ev.target.value.toLocaleLowerCase()) && persona.id_persona != usuario.id_persona;
                      })
                    );
                  }
                }}
                placeholder="Introduzca el ID del persona"
              />
            </Form.Item>
          </Col>
          <Col span={24} md={{ span: 24 }} xl={{ span: 10 }}>
            <Form.Item label="Nombre de Persona">
              <Input
                onChange={(ev) => {
                  if (ev.target.value == "") {
                    setDisplayPersonas(personas.filter(value => value.id_persona != usuario.id_persona))
                  }
                  else {
                    setDisplayPersonas(
                      personas.filter((value) => {
                        return `${value.nombres} ${value.paterno} ${value.materno}`
                          .toLocaleLowerCase()
                          .includes(ev.target.value.toLocaleLowerCase()) && value.id_persona != usuario.id_persona;
                      })
                    );
                  }
                }}
                placeholder="Introduzca el nombre de la persona"
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <hr />
      <Table
        className="mt-2"
        scroll={{ x: 800, y: 500 }}
        rowKey={(persona) => persona.id_persona + "T"}
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
        dataSource={displayPersonas}
        onRow={(value, index) => {
          return {
            onClick: (ev: any) => {
              try {
                if (ev.target.className.includes("switch")) {
                  axios
                    .post(process.env.BACKEND_URL + "/persona/estado", {
                      id_persona: value.id_persona,
                      usuario: usuario
                    })
                    .then((res) => {
                      message.success("¡Personal cambiado con éxito!");
                      axios
                        .get<Persona[]>(
                          process.env.BACKEND_URL + "/persona/all"
                        )
                        .then((res) => {
                          setPersonas(res.data);
                          setDisplayPersonas(
                            res.data.filter((value) => {
                              return value.id_persona != persona1.id_persona;
                            })
                          );
                        });
                    });
                } else if (ev.target.className.includes("ant-btn")) {
                  setOpen(true);
                  axios
                    .post(process.env.BACKEND_URL + "/persona/get", {
                      id_persona: value.id_persona,
                    })
                    .then((res) => {
                      setPersona(res.data);
                      setLoaded(true);
                    });
                }
              } catch (error) {
                setOpen(true);
                axios
                  .post(process.env.BACKEND_URL + "/persona/get", {
                    id_persona: value.id_persona,
                  })
                  .then((res) => {
                    setPersona(res.data);
                    setLoaded(true);
                  });
              }
            },
          };
        }}
      />

      <PersonaModal
        persona={persona}
        loaded={loaded}
        setDisplayPersonas={setDisplayPersonas}
        setPersona={setPersona}
        setPersonas={setPersonas}
        key="personamodal"
        open={open}
        setOpen={setOpen}
        persona1={persona1}
        usuario={usuario}
      ></PersonaModal>
    </>
  );
};

export default Informacion;
