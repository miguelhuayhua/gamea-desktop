;
import {
  Avatar,
  Button,
  Card,
  Col,
  Drawer,
  Form,
  List,
  Modal,
  Popconfirm,
  Row,
  Select,
  notification,
} from "antd";
import { NextPage } from "next";
import { UserOutlined } from "@ant-design/icons";
import { AiOutlineFilePdf } from "react-icons/ai";
import { createContext, useState } from "react";
import { FaEye } from "react-icons/fa";

import { Adulto } from "../../adultos/data";
import { Caso, Citacion } from "../data";
import { Persona } from "../../personal/data";
import dynamic from "next/dynamic";
const TextArea = dynamic(async () => await import("antd/es/input/TextArea"), {
  ssr: false,
})
import { PDFViewer, pdf } from "@react-pdf/renderer";
import FormularioAudienciaSuspendida from "./pdf-audiencia-suspendida";
import { Audiencia, Citado, dataAudiencia } from "../nuevocaso/data";
import axios from "axios";
import { Usuario } from "../../usuarios/data";
interface Props {
  setOpen2: any;
  open2: boolean;
  caso: Caso;
  persona: Persona;
  adulto: Adulto;
  citacion: Citacion;
  citados: Citado[];
  usuario: Usuario;
}


const ModalAudienciaSuspendida: NextPage<Props> = (props) => {
  const [open, setOpen] = useState(false);
  const [audiencia, setAudiencia] = useState<Audiencia>(dataAudiencia);
  return (
    <>
      <Modal
        key="modal"
        title={`DETALLE DE SUSPENSIÓN`}
        centered
        style={{ textAlign: "center" }}
        open={props.open2}
        width={"85%"}
        onCancel={() => {
          props.setOpen2(false);
        }}
        footer={[
          <Button
            key={"btn-vista-2"}
            onClick={() => {
              setOpen(true);
            }}
            style={{ height: 45 }}
          >
            Vista previa documento
            <FaEye
              style={{
                fontSize: 20,
                marginLeft: 10,
              }}
            />
          </Button>,
          <Popconfirm
            key="popconfirm"
            title="¿Estás seguro de continuar?"
            onConfirm={() => {
              axios
                .post<{ status: number; message: string }>(
                  process.env.BACKEND_URL + "/caso/audiencia/add",
                  {
                    id_citacion: props.citacion.id_citacion,
                    audiencia: audiencia,
                    usuario: props.usuario
                  }
                )
                .then((res) => {
                  if (res.data.status == 1) {
                    notification.success({ message: res.data.message });
                    pdf(

                      <FormularioAudienciaSuspendida
                        adulto={props.adulto}
                        caso={props.caso}
                        persona={props.persona}
                        citacion={props.citacion}
                        audiencia={audiencia}

                      />
                    )
                      .toBlob()
                      .then((blob) => {
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
                        notification.success({
                          message: "Formulario generado con éxito...",
                        });
                        props.setOpen2(false);
                      });
                  } else {
                    notification.error({ message: res.data.message });
                  }
                });
            }}
          >
            <Button onClick={() => { }} style={{ height: 45 }}>
              Aceptar y Generar
              <AiOutlineFilePdf
                style={{
                  color: "#b51308",
                  fontSize: 20,
                }}
              />
            </Button>
          </Popconfirm>,
          <Button
            key="cancel"
            onClick={() => {
              props.setOpen2(false);
            }}
            style={{ height: 45 }}
          >
            Cancelar
          </Button>,
        ]}
      >
        <Row gutter={24}>
          <Col span={24} lg={{ span: 12 }}>
            <Form>
              <Row>
                <Col span={24}>
                  <Form.Item label="Motivo de la suspensión: ">
                    <Select
                      defaultValue="ina_adulto"
                      onChange={(ev) => {
                        setAudiencia({ ...audiencia, causa: ev });
                      }}
                      options={[
                        {
                          value: "ina_adulto",
                          label: "Inasistencia Adulto(a) Mayor",
                        },
                        {
                          value: "ina_invitado",
                          label: "Inasistencia Parte Invitada",
                        },
                        { value: "ambos", label: "Ambos" },
                      ]}
                    />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item label="Observación: ">
                    <TextArea
                      placeholder="Introduzca alguna observación si acontece..."
                      autoSize={{ minRows: 3, maxRows: 5 }}
                      allowClear
                      onChange={(ev) => {
                        setAudiencia({
                          ...audiencia,
                          observacion: ev.target.value,
                        });
                      }}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Col>
          <Col span={12}>
            <Card bordered={false} title={"Detalles de la suspensión"}>
              <Row>
                <Col span={8}>
                  <p>
                    <b>Fecha Acordada: </b>
                    {props.citacion.fecha_citacion}
                  </p>
                </Col>
                <Col span={8}>
                  <p>
                    <b>Hora Acordada:</b>
                    {props.citacion.hora_citacion}
                  </p>
                </Col>
                <Col span={8}>
                  <p>
                    <b>Inicio de caso: </b>
                    {props.caso.fecha_registro}
                  </p>
                </Col>
              </Row>
              <List
                className="demo-loadmore-list"
                header={
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-around",
                    }}
                  >
                    <h6>
                      <b>Lista de citados</b>
                    </h6>
                  </div>
                }
                itemLayout="horizontal"
                dataSource={props.citados}
                rowKey={(item) => item.nombres_apellidos}
                renderItem={(item, index) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={
                        <Avatar
                          style={{
                            backgroundColor:
                              item.genero == "Femenino" ? "#ff0080" : "#0041c8",
                            color: "white",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                          icon={<UserOutlined />}
                        />
                      }
                      title={<p>{item.nombres_apellidos}</p>}
                    />
                  </List.Item>
                )}
              />
            </Card>
          </Col>
        </Row>
      </Modal>
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
          <FormularioAudienciaSuspendida
            adulto={props.adulto}
            caso={props.caso}
            persona={props.persona}
            citacion={props.citacion}
            audiencia={audiencia}

          />
        </PDFViewer>
      </Drawer>
    </>
  );
};

export default ModalAudienciaSuspendida;
