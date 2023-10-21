;
import {
  Avatar,
  Button,
  Col,
  Form,
  Modal,
  Popconfirm,
  Row,
  Segmented,
  Select,
  Space,
  notification,
} from "antd";
import { NextPage } from "next";

import { createContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { EditOutlined, PlusOutlined, UserOutlined } from "@ant-design/icons";
import { Caso, Denunciado, datosCaso } from "../data";
import dynamic from "next/dynamic";
const TextArea = dynamic(async () => await import("antd/es/input/TextArea"), {
  ssr: false,
})
import moment from "moment";
import { AiFillFilePdf } from "react-icons/ai";

import { AdultoMayor2 } from "../nuevocaso/data";
import { pdf } from "@react-pdf/renderer";
import Formulario from "./pdf";
import { Domicilio } from "../../adultos/data";
import { Persona } from "../../personal/data";

import { Usuario } from "../../usuarios/data";
import dayjs from "dayjs";
export const DataContext = createContext({});
//ROUTING

//PDF
interface Props {
  open: boolean;
  setOpen: any;
  caso: Caso;
  setCaso: any;
  adultoMayor: AdultoMayor2;
  denunciado: Denunciado;
  usuario: Usuario;
  setCasos: any;
  setDisplayCasos: any;
}
const CasoModal: NextPage<Props> = (props) => {
  //control del modal
  const handleConfirm = () => {
    props.setOpen(false);
    axios
      .post(process.env.BACKEND_URL + "/caso/update", { ...props.caso, usuario: props.usuario })
      .then((res) => {
        if (res.data.status == 1) {
          notification.success({
            message: `El caso ${props.caso.nro_caso} se modificó con éxito`,
            duration: 7,
          });
          axios
            .get<Caso[]>(process.env.BACKEND_URL + "/caso/all")
            .then((res) => {
              props.setCasos(res.data);
              props.setDisplayCasos(res.data);
            });
        } else {
          notification.error({ message: "No se pudo modificar el caso..." });
        }
      });
  };
  const handleHideModal = () => {
    props.setOpen(false);
  };

  //cambio del estado de caso
  const handleDescripcion = (value: any) => {
    props.setCaso({ ...props.caso, descripcion_hechos: value.target.value });
  };
  const handlePeticion = (value: any) => {
    props.setCaso({ ...props.caso, peticion: value.target.value });
  };
  const handleAcciones = (value: any) => {
    props.setCaso({ ...props.caso, accion_realizada: value });
  };

  return (
    <>
      <Modal
        key="modal"
        title={
          ` EDITE LOS VALORES PARA EL CASO ${props.caso.nro_caso}`
        }
        centered
        style={{ textAlign: "center" }}
        open={props.open}
        onCancel={() => {
          props.setOpen(false);
        }}
        footer={[
          <Popconfirm
            key="popconfirm"
            title="¿Estás seguro de continuar?"
            onConfirm={handleConfirm}
            okText="Sí"
            cancelText="No"
          >
            <Button key="ok" type="primary">
              Aceptar y Modificar
            </Button>
          </Popconfirm>,
          <Button key="cancel" onClick={handleHideModal}>
            Cancelar
          </Button>,
          <Button
            key={"btn-caso"}
            style={{
              backgroundColor: "#b51308",
              color: 'white',
            }}
            onClick={async () => {
              notification.info({
                message: "Generando formulario, espere por favor...",
              });
              let id_persona = localStorage.getItem('id_persona');
              let id_usuario = localStorage.getItem('id_usuario');
              if (id_persona && id_usuario) {
                axios.post<Persona>(process.env.BACKEND_URL + "/persona/get", { id_persona: id_persona }).then(res => {
                  axios
                    .post<Domicilio>(
                      process.env.BACKEND_URL + "/domicilio/getByIdAdulto",
                      {
                        id_adulto: props.adultoMayor.id_adulto,
                      }
                    )
                    .then((res3) => {
                      pdf(
                        <DataContext.Provider
                          value={{
                            datosGenerales: props.adultoMayor,
                            descripcionHechos: props.caso.descripcion_hechos,
                            descripcionPeticion: props.caso.peticion,
                            datosDenunciado: props.denunciado,
                            accionRealizada: props.caso.accion_realizada,
                            datosDenuncia: props.caso,
                            datosUbicacion: res3.data,
                            persona: res.data
                          }}
                        >
                          <Formulario />
                        </DataContext.Provider>
                      )
                        .toBlob()
                        .then((blob) => {
                          const url = URL.createObjectURL(blob);
                          const link = document.createElement("a");
                          link.href = url;
                          let { nombre, paterno, materno } =
                            props.adultoMayor;

                          link.setAttribute(
                            "download",
                            nombre +
                            paterno +
                            materno +
                            props.caso.fecha_registro +
                            ".pdf"
                          );
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                          notification.success({
                            message: "Formulario generado con éxito",
                          });
                        })
                        .catch((e) => {
                          notification.error({ message: e });
                        });
                    });
                })
              }

            }
            }
          >
            Generar Formulario
          </Button>
        ]}
      >
        <Row gutter={[24, 0]}>
          <Col span={24}>
            <Row>
              <Col span={24}>
                <p className="info">
                  <span>Fecha de Registro del caso: </span>
                  {props.caso.fecha_registro}
                </p>
              </Col>
              <Col span={24}>
                <p className="info">
                  <span>Hora de registro del caso: </span>
                  {props.caso.hora_registro}
                </p>
              </Col>
              <Col span={24}>
                <p className="info">
                  <span>Última modifcación: </span>
                  {dayjs(props.caso.ult_modificacion).format("DD/MM/YYYY - HH:mm:ss")}
                </p>
              </Col>
            </Row>
          </Col>
          <Col span={24}>
            <Form layout="horizontal">
              <b className="mt-4">Descripción de los hechos</b>
              <Form.Item>
                <TextArea
                  allowClear
                  showCount
                  maxLength={1000}
                  style={{ height: 150, resize: "none" }}
                  value={props.caso.descripcion_hechos}
                  onChange={handleDescripcion}
                />
              </Form.Item>
              <b className="mt-4">Petición del adulto</b>

              <Form.Item >
                <TextArea
                  allowClear
                  showCount
                  maxLength={1000}
                  style={{ height: 150, resize: "none" }}
                  value={props.caso.peticion}
                  onChange={handlePeticion}
                />
              </Form.Item>
              <b className="mt-4">Acciones realizadas con el caso</b>
              <Form.Item
                className="normal-input"
              >
                <Select
                  value={props.caso.accion_realizada}
                  onChange={handleAcciones}
                  style={{ width: "90%" }}
                >
                  <Select.Option value="Apertura">
                    Apertura de Caso
                  </Select.Option>
                  <Select.Option value="Orientacion">Orientación</Select.Option>
                  <Select.Option value="Citacion">Citación</Select.Option>
                  <Select.Option value="Derivacion">Derivación</Select.Option>
                </Select>
              </Form.Item>
            </Form>

          </Col>
          <Col
            span={24}
            style={{ border: "1px solid #CCC", padding: 10, borderRadius: 10 }}
          >
            <h6 className="text-center">Adulto Mayor</h6>
            <Row>
              <hr />
              <Col span={6}>
                <Avatar
                  style={{
                    backgroundColor:
                      props.adultoMayor.genero == "Femenino"
                        ? "#ff0080"
                        : "#0041c8",
                    color: "white",
                    width: 60,
                    height: 60,
                    fontSize: 30,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    margin: "0 auto",
                  }}
                  icon={<UserOutlined />}
                ></Avatar>
              </Col>
              <Col span={18} style={{ textAlign: "start" }}>
                <p>
                  <span>
                    <b>Adulto Mayor: </b>
                  </span>
                  {props.adultoMayor.nombre +
                    " " +
                    props.adultoMayor.paterno +
                    " " +
                    props.adultoMayor.materno}
                </p>
                <p>
                  <span>
                    <b>C.I.: </b>
                  </span>
                  {props.adultoMayor.ci}
                  <br />
                  <span>
                    <b> Edad: </b>
                  </span>
                  {props.adultoMayor.edad}
                  <br />
                  <span>
                    <b> Número de referencia: </b>
                  </span>
                  {props.adultoMayor.nro_referencia}
                </p>
              </Col>

              <Col span={24}>
                <hr />
              </Col>
              <Col span={24}>
                <h6>Hijos</h6>
                <Space direction="vertical">
                  {props.adultoMayor.hijos.length == 0 ? (
                    <>
                      <h6>La persona no tiene hijos...</h6>
                    </>
                  ) : (
                    <Segmented
                      options={props.adultoMayor.hijos.map((hijo) => {
                        return {
                          label: (
                            <div
                              key={hijo.nombres_apellidos}
                              style={{ padding: 4 }}
                            >
                              <Avatar
                                style={{
                                  backgroundColor:
                                    hijo.genero == "Femenino"
                                      ? "#ff0080"
                                      : "#0041c8",
                                  color: "white",
                                  width: 30,
                                  height: 30,
                                  fontSize: 15,
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  margin: "0 auto",
                                }}
                                icon={<UserOutlined />}
                              ></Avatar>
                              <div>{hijo.nombres_apellidos}</div>
                            </div>
                          ),
                          value: hijo.nombres_apellidos,
                        };
                      })}
                    />
                  )}
                </Space>
              </Col>
              <Col span={24}>
                <h6>Denunciado</h6>
                <Row>
                  <Col span={6}>
                    <Avatar
                      style={{
                        backgroundColor:
                          props.denunciado.genero == "Femenino"
                            ? "#ff0080"
                            : "#0041c8",
                        color: "white",
                        width: 60,
                        height: 60,
                        fontSize: 30,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        margin: "0 auto",
                      }}
                      icon={<UserOutlined />}
                    ></Avatar>
                  </Col>
                  <Col span={18}>
                    <Row>
                      <Col span={24}>
                        <p>
                          <span>
                            <b>Denunciado:</b>
                          </span>
                          {props.denunciado.nombres +
                            " " +
                            props.denunciado.paterno +
                            " " +
                            props.denunciado.materno}
                        </p>
                      </Col>

                      <Col span={24}>
                        <p>
                          <span>
                            <b>Parentezco: </b>
                          </span>
                          {props.denunciado.parentezco}
                        </p>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>
        </Row>
      </Modal>
    </>
  );
};
export default CasoModal;
