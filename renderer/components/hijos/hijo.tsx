;
import {
  Avatar,
  Button,
  Col,
  Form,
  Input,
  Modal,
  Popconfirm,
  Radio,
  Row,
  Skeleton,
  Slider,
  message,
  notification,
} from "antd";
import { NextPage } from "next";
import { UserOutlined, CopyOutlined } from "@ant-design/icons";

import { createContext } from "react";
import axios from "axios";
import moment from "moment";
import { Hijo } from "./data";
import { Adulto } from "../adultos/data";
import { Usuario } from "../usuarios/data";
export const DataContext = createContext({});
//ROUTING

//PDF
interface Props {
  setOpen: any;
  open: boolean;
  usuario: Usuario;
  hijo: Hijo;
  setHijo: any;
  setHijos: any;
  loaded: boolean;
  setDisplayHijos: any;
  adulto: Adulto;
}
const HijoModal: NextPage<Props> = (props) => {
  //control del modal
  const handleConfirm = () => {
    props.setOpen(false);
    axios
      .post(process.env.BACKEND_URL + "/hijo/update", { ...props.hijo, usuario: props.usuario })
      .then((res) => {
        if (res.data.status == 1) {
          notification.success({
            message: `¡Los datos de ${props.hijo.nombres_apellidos} se modificaron con éxito!`,
          });
          axios.get<Adulto[]>(process.env.BACKEND_URL + "/hijo/all").then((res) => {
            props.setHijos(res.data);
            props.setDisplayHijos(res.data);
          });
        } else {
          notification.error({
            message: "No se pudo modificar los datos de la persona adulta...",
          });
        }
      });
  };
  const handleHideModal = () => {
    props.setOpen(false);
  };

  return (
    <>
      <Modal
        key="modal"
        title={`EDITE LOS VALORES PARA EL HIJO(A) DE ${props.adulto.nombre.toLocaleUpperCase()} ${props.adulto.paterno.toLocaleUpperCase()} ${props.adulto.materno.toLocaleUpperCase()}`}
        centered
        style={{ textAlign: "center" }}
        open={props.open}
        onCancel={() => {
          props.setOpen(false);
        }}
        width={"90%"}
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
        ]}
      >
        {props.loaded ? (
          <Row gutter={24}>
            <Col span={24}>
              <p style={{ color: "gray", textAlign: "start" }}>
                <span>Última modifcación: </span>
                {moment(props.hijo.ult_modificacion).format(
                  "DD-MM-YYYY HH:mm:ss"
                )}
              </p>
            </Col>
            <Col span={4}>
              <Avatar
                style={{
                  backgroundColor:
                    props.hijo.genero == "Femenino" ? "#ff0080" : "#0041c8",
                  color: "white",
                  width: 70,
                  height: 70,
                  fontSize: 40,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto",
                }}
                icon={<UserOutlined />}
              ></Avatar>
              <b style={{ marginLeft: 10 }}>ID: </b>
              {props.hijo.id_hijo}
              <Button
                style={{ marginLeft: 5 }}
                onClick={() => {
                  const textField = document.createElement("textarea");
                  textField.innerText = props.adulto.id_adulto;
                  document.body.appendChild(textField);
                  textField.select();
                  navigator.clipboard
                    .writeText(props.adulto.id_adulto)
                    .then(() => {
                      textField.remove();
                      message.success("¡ID - Hijo, copiado al portapapeles!");
                    });
                }}
                icon={<CopyOutlined color="blue" />}
              ></Button>
            </Col>
            <Col span={20}>
              <Form>
                <Row gutter={[24, 24]}>
                  <Col span={24} md={{ span: 16 }}>
                    <Form.Item label="Nombres y Apellidos: ">
                      <Input
                        name="nombre"
                        value={props.hijo.nombres_apellidos}
                        onChange={(value) =>
                          props.setHijo({
                            ...props.hijo,
                            nombres_apellidos: value.target.value,
                          })
                        }
                      />
                    </Form.Item>
                  </Col>
                  <Col span={24} md={{ span: 8 }}>
                    <Form.Item label="Género:">
                      <Radio.Group
                        value={props.hijo.genero}
                        defaultValue={props.hijo.genero}
                        onChange={(value) => {
                          props.setHijo({
                            ...props.hijo,
                            genero: value.target.value,
                          });
                        }}
                      >
                        <Radio value="Femenino"> Femenino </Radio>
                        <Radio value="Masculino"> Masculino </Radio>
                      </Radio.Group>
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </Col>
          </Row>
        ) : (
          <Skeleton avatar active paragraph={{ rows: 4 }}></Skeleton>
        )}
      </Modal>
    </>
  );
};
export default HijoModal;
