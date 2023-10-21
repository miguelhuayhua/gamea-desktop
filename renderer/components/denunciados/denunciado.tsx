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
  message,
  notification,
} from "antd";
import { NextPage } from "next";

import axios from "axios";
import moment from "moment";
import { Denunciado, dataDenunciado } from "./data";
import { UserOutlined, CopyOutlined } from "@ant-design/icons";
import { Usuario } from "../usuarios/data";
import dayjs from "dayjs";

//ROUTING

//PDF
interface Props {
  setOpen: any;
  open: boolean;
  usuario: Usuario;
  denunciado: Denunciado;
  setDenunciado: any;
  setDenunciados: any;
  loaded: boolean;
  setDisplayDenunciados: any;
}
const DenunciadoModal: NextPage<Props> = (props) => {
  //control del modal
  const handleConfirm = () => {
    props.setOpen(false);
    axios
      .post<{ status: number; message: string }>(
        process.env.BACKEND_URL + "/denunciado/update",
        {
          ...props.denunciado,
          usuario: props.usuario
        }
      )
      .then((res) => {
        if (res.data.status == 1) {
          notification.success({ message: res.data.message });
          props.setOpen(false);
          axios
            .get<Denunciado[]>(process.env.BACKEND_URL + "/denunciado/all")
            .then((res) => {
              props.setDenunciados(res.data);
              props.setDisplayDenunciados(res.data);
            });
        } else {
          notification.error({ message: res.data.message });
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
        title={`EDITE LOS VALORES DEL DENUNCIADO`}
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
        ]}
      >
        {props.loaded ? (
          <Row gutter={24}>
            <Col span={24}>
              <p className="info">
                <span>Última modifcación: </span>
                {dayjs(props.denunciado.ult_modificacion).format(
                  "DD/MM/YYYY - HH:mm:ss"
                )}
              </p>
            </Col>
            <Col span={24} className="mt-3">
              <Avatar
                style={{
                  backgroundColor:
                    props.denunciado.genero == "Femenino"
                      ? "#ff0080"
                      : "#0041c8",
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
              {props.denunciado.id_denunciado}
              <Button
                style={{ marginLeft: 5 }}
                onClick={() => {
                  const textField = document.createElement("textarea");
                  textField.innerText = props.denunciado.id_denunciado;
                  document.body.appendChild(textField);
                  textField.select();
                  navigator.clipboard
                    .writeText(props.denunciado.id_denunciado)
                    .then(() => {
                      textField.remove();
                      message.success(
                        "¡ID - Denunciado, copiado al portapapeles!"
                      );
                    });
                }}
                icon={<CopyOutlined color="blue" />}
              ></Button>
            </Col>
            <Col span={20} offset={2}>
              <Form>
                <Row gutter={[24, 24]}>
                  <Col span={24}>
                    <Form.Item label="Nombres: ">
                      <Input
                        name="nombre"
                        value={props.denunciado.nombres}
                        onChange={(value) =>
                          props.setDenunciado({
                            ...props.denunciado,
                            nombres: value.target.value,
                          })
                        }
                      />
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item label="Apellido Paterno: ">
                      <Input
                        name="nombre"
                        value={props.denunciado.paterno}
                        onChange={(value) =>
                          props.setDenunciado({
                            ...props.denunciado,
                            paterno: value.target.value,
                          })
                        }
                      />
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item label="Apellido Materno: ">
                      <Input
                        name="nombre"
                        value={props.denunciado.materno}
                        onChange={(value) =>
                          props.setDenunciado({
                            ...props.denunciado,
                            materno: value.target.value,
                          })
                        }
                      />
                    </Form.Item>
                  </Col>

                  <Col span={24} >
                    <Form.Item label="genero:">
                      <Radio.Group
                        value={props.denunciado.genero}
                        defaultValue={props.denunciado.genero}
                        onChange={(value) => {
                          props.setDenunciado({
                            ...props.denunciado,
                            genero: value.target.value,
                          });
                        }}
                      >
                        <Radio value="Femenino"> Femenino </Radio>
                        <Radio value="Masculino"> Masculino </Radio>
                      </Radio.Group>
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item label="C.I. Denunciado: ">
                      <Input
                        name="ci"
                        value={props.denunciado.ci}
                        onChange={(value) =>
                          props.setDenunciado({
                            ...props.denunciado,
                            ci: value.target.value,
                          })
                        }
                      />
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
export default DenunciadoModal;
