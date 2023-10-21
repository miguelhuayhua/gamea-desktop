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
  FileDoneOutlined,
  FileExcelFilled,
  FilePdfFilled,
  LoadingOutlined,
} from "@ant-design/icons";

import dayjs from "dayjs";
import isBeetwen from "dayjs/plugin/isBetween";
import DenunciadoModal from "./denunciado";
import { AiOutlineReload, AiOutlineUserAdd } from "react-icons/ai";
import { pdf } from "@react-pdf/renderer";
import PdfDenunciado from "./pdf-listado";
import dynamic from "next/dynamic";
const Paragraph = dynamic(async () => await import("antd/es/typography/Paragraph"), {
  ssr: false,
}); import { Denunciado, dataDenunciado } from "./data";
import { Persona, dataPersona } from "../personal/data";
import { Usuario, dataUsuario } from "../usuarios/data";
export const context3 = createContext({});
//ROUTING

const Informacion = () => {
  dayjs.extend(isBeetwen);
  //estados
  const [loaded, setLoaded] = useState(false);
  const [open, setOpen] = useState(false);

  const columns: ColumnsType<Denunciado> = [
    {
      title: "ID Denunciado",
      dataIndex: "id_denunciado",
      key: "id_denunciado",
      className: "text-center",
      fixed: "left",
      width: 130,
      render(_, denunciado) {
        return (
          <Paragraph className="center" copyable={{ tooltips: "Copiar", onCopy: () => message.success({ content: "Copiado exitosamente" }) }}>
            {denunciado.id_denunciado}
          </Paragraph>
        );
      },
    },
    {
      title: "Nombres y Apellidos",
      key: "accion_realizada",
      render: (_, Denunciado) => {
        return `${Denunciado.nombres} ${Denunciado.paterno} ${Denunciado.materno}`;
      },
      className: "text-center",
    },
    {
      title: "Estado",
      key: "estado",
      dataIndex: "estado",
      width: 120,
      className: "text-center",
      render: (_, Denunciado) =>
        Denunciado.estado == 1 ? (
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
      width: 160,
      render: (_, denunciado) => (
        <div
          key={denunciado.id_denunciado + "d"}
          className="d-flex align-items-center justify-content-around"
        >
          {denunciado.estado != 1 ? null : (
            <Button
              key={denunciado.id_denunciado}
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
                key={denunciado.id_denunciado + "-"}
                checked={denunciado.estado == 1}
              />
            </>
          ) : null}
        </div>
      ),
    },
  ];
  const [denunciados, setDenunciados] = useState<Denunciado[]>([]);
  const [denunciado, setDenunciado] = useState<Denunciado>(dataDenunciado);
  const [displayDenunciados, setDisplayDenunciados] = useState<Denunciado[]>(
    []
  );

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
        .get<Denunciado[]>(process.env.BACKEND_URL + "/denunciado/all")
        .then((res) => {
          setDenunciados(res.data);
          setDisplayDenunciados(res.data);
        });

    }
  }, []);

  //cambios en los filtros
  return (
    <>
      <Row>
        <Col span={24} lg={{ span: 10 }}>
          <h5 className="mt-4">
            {' Filtros para "Denunciados"'} <FilterOutlined />
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
                  <context3.Provider
                    value={{
                      denunciados: displayDenunciados,
                      persona: persona,
                    }}
                  >
                    <PdfDenunciado />
                  </context3.Provider>
                )
                  .toBlob()
                  .then((blob) => {
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement("a");
                    link.href = url;
                    let nombrePdf = `Denunciados-${dayjs().year()}-${dayjs().month()}-${dayjs().date()}.pdf`;
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
                  .get(process.env.BACKEND_URL + "/denunciado/report", {
                    responseType: "blob",
                  })
                  .then((res) => {
                    const url = URL.createObjectURL(res.data);
                    const link = document.createElement("a");
                    link.href = url;
                    link.setAttribute(
                      "download",
                      "Denunciados-" +
                      dayjs().format("DD-MM-YYYY_HH:mm:ss") +
                      ".xlsx"
                    );
                    link.click();
                    link.remove();
                    notification.success({
                      message: (
                        <p style={{ fontSize: 14 }}>
                          {"¡Excel: Denunciados-" +
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
                .get<Denunciado[]>(process.env.BACKEND_URL + "/denunciado/all")
                .then((res) => {
                  setDenunciados(res.data);
                  setDisplayDenunciados(res.data);
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
          <Col span={24} md={{ span: 12 }} >
            <Form.Item label="ID de denunciado ">
              <Input
                placeholder="Introduzca el ID del Denunciado"
                onChange={(ev) => {
                  setDisplayDenunciados(
                    denunciados.filter((value) => {
                      return value.id_denunciado.includes(
                        ev.target.value.toLocaleUpperCase()
                      );
                    })
                  );
                }}
              />
            </Form.Item>
          </Col>
          <Col span={24} lg={{ span: 12 }}>
            <Form.Item label="Nombres y apellidos:">
              <Input
                placeholder="Ingrese nombres y apellidos del denunciado"
                onChange={(ev) => {
                  setDisplayDenunciados(
                    denunciados.filter((value) => {
                      return `${value.nombres} ${value.paterno} ${value.materno}`
                        .toLocaleLowerCase()
                        .includes(ev.target.value.toLocaleLowerCase());
                    })
                  );
                }}
              ></Input>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <Table
        className="mt-2"
        scroll={{ x: 800, y: 500 }}
        rowKey={(Denunciado) => Denunciado.id_denunciado + "T"}
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
        dataSource={displayDenunciados}
        onRow={(value, index) => {
          return {
            onClick: (ev: any) => {
              try {
                if (ev.target.className.includes("switch")) {
                  axios
                    .post(process.env.BACKEND_URL + "/denunciado/estado", {
                      id_denunciado: value.id_denunciado, usuario: usuario
                    })
                    .then((res) => {
                      message.success("¡Denunciado cambiado con éxito!");
                      axios
                        .get<Denunciado[]>(
                          process.env.BACKEND_URL + "/denunciado/all"
                        )
                        .then((res) => {
                          setDenunciados(res.data);
                          setDisplayDenunciados(res.data);
                        });
                    });
                } else if (ev.target.className.includes("ant-btn")) {
                  setOpen(true);
                  axios
                    .post(process.env.BACKEND_URL + "/denunciado/getById", {
                      id_denunciado: value.id_denunciado,
                    })
                    .then((res) => {
                      setDenunciado(res.data);
                      setLoaded(true);
                    });
                }
              } catch (error) {
                setOpen(true);
                axios
                  .post(process.env.BACKEND_URL + "/denunciado/getById", {
                    id_denunciado: value.id_denunciado,
                  })
                  .then((res) => {
                    setDenunciado(res.data);
                    setLoaded(true);
                  });
              }
            },
          };
        }}
      />

      <DenunciadoModal
        denunciado={denunciado}
        loaded={loaded}
        setDisplayDenunciados={setDisplayDenunciados}
        setDenunciado={setDenunciado}
        setDenunciados={setDenunciados}
        key="Denunciadomodal"
        open={open}
        setOpen={setOpen}
        usuario={usuario}
      ></DenunciadoModal>
    </>
  );
};
export default Informacion;
