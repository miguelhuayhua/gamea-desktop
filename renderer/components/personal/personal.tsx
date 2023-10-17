import { NextPage } from "next";
import { Persona } from "./data";
import { UserOutlined, CopyOutlined } from "@ant-design/icons";

import {
  Avatar,
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Radio,
  Row,
  Select,
  Skeleton,
  Space,
  notification,
} from "antd";
import axios from "axios";
import { departamentos } from "../casos/nuevocaso/data";
import { Usuario } from "../usuarios/data";

interface Props {
  setOpen: any;
  open: boolean;
  persona: Persona;
  setPersona: any;
  setPersonas: any;
  loaded: boolean;
  setDisplayPersonas: any;
  persona1: Persona;
  usuario: Usuario
}
const PersonaModal: NextPage<Props> = (props) => {
  const handleConfirm = () => {
    axios
      .post<{ status: number }>(process.env.BACKEND_URL + "/persona/update", {
        ...props.persona,
        usuario: props.usuario
      })
      .then((res) => {
        if (res.data.status == 1) {
          notification.success({
            message: `Personal ${props.persona.nombres +
              " " +
              props.persona.paterno +
              " " +
              props.persona.materno
              } editado con éxito`,
          });
          props.setOpen(false);
          axios
            .get<Persona[]>(process.env.BACKEND_URL + "/persona/all")
            .then((res) => {
              props.setPersonas(res.data);
              props.setDisplayPersonas(
                res.data.filter((value) => {
                  return value.id_persona != props.persona1.id_persona;
                })
              );
            });
        } else {
          notification.error({
            message: "No se pudo modificar los datos del personal...",
          });
        }
      });
  };
  return (
    <>
      <Modal
        key="modal"
        title={`EDITE LOS VALORES PARA EL PERSONAL ${props.persona.nombres +
          " " +
          props.persona.paterno +
          " " +
          props.persona.materno
          }`}
        centered
        style={{ textAlign: "center" }}
        open={props.open}
        onCancel={() => {
          props.setOpen(false);
        }}
        footer={[
          <Popconfirm
            key="popconfirm"
            title="¿Estás seguro de editar?"
            onConfirm={handleConfirm}
            okText="Sí"
            cancelText="No"
          >
            <Button
              style={{ margin: "10px auto" }}
              htmlType="submit"
              type="primary"
            >
              Aceptar y Modificar
            </Button>
          </Popconfirm>,
          <Button
            key="cancel"
            onClick={() => {
              props.setOpen(false);
            }}
          >
            Cancelar
          </Button>,
        ]}
      >
        {props.loaded ? (
          <Form>
            <Row gutter={[12, 12]}>
              <Col span={4} offset={10}>
                <Avatar
                  style={{
                    backgroundColor:
                      props.persona.genero == "Femenino"
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
              </Col>
              <Col span={24}>
                <Form.Item
                  rules={[
                    {
                      required: true,
                      message: "Por favor introduzca su nombre paterno",
                    },
                  ]}
                  label="Profesión/ Nombres: "
                  name="nombre"
                >
                  <Space.Compact style={{ width: "100%" }}>
                    <Input
                      style={{ width: "30%" }}
                      placeholder="Ej. Lic., Ing., Abog."
                      onChange={(ev) => {
                        props.setPersona({
                          ...props.persona,
                          profesion: ev.target.value,
                        });
                      }}
                      value={props.persona.profesion}
                    />
                    <Input
                      style={{ width: "70%" }}
                      placeholder="Introduzca su nombre..."
                      onChange={(ev) => {
                        props.setPersona({
                          ...props.persona,
                          nombres: ev.target.value,
                        });
                      }}
                      value={props.persona.nombres}
                    />
                  </Space.Compact>
                </Form.Item>
              </Col>
              <Col span={24} >
                <Form.Item label="Apellido Paterno: ">
                  <Input
                    name="paterno"
                    onChange={(ev) => {
                      props.setPersona({
                        ...props.persona,
                        paterno: ev.target.value,
                      });
                    }}
                    value={props.persona.paterno}
                  ></Input>
                </Form.Item>
              </Col>
              <Col span={24} >
                <Form.Item label="Apellido Materno: ">
                  <Input
                    name="materno"
                    onChange={(ev) => {
                      props.setPersona({
                        ...props.persona,
                        materno: ev.target.value,
                      });
                    }}
                    value={props.persona.materno}
                  ></Input>
                </Form.Item>
              </Col>
              <Col span={24}>
                <Space.Compact direction="horizontal">
                  <Form.Item label="C.I. / Expedido:">
                    <InputNumber
                      required
                      name="ci"
                      className="w-100"
                      onChange={(ev: any) => {
                        props.setPersona({ ...props.persona, ci: ev });
                      }}
                      value={props.persona.ci}
                    ></InputNumber>
                  </Form.Item>
                  <Form.Item>
                    <Select
                      aria-required
                      className="w-100" defaultValue="LP"
                      options={departamentos}
                      value={props.persona.expedido!}
                      onChange={(value) => {
                        props.setPersona({ ...props.persona, expedido: value });
                      }}
                    />
                  </Form.Item>
                </Space.Compact>
              </Col>
              <Col span={24} >
                <Form.Item label="Celular: ">
                  <InputNumber
                    name="celular"
                    className="w-100"
                    onChange={(ev: any) => {
                      props.setPersona({
                        ...props.persona,
                        celular: ev,
                      });
                    }}
                    value={props.persona.celular}
                  ></InputNumber>
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label="Género:">
                  <Radio.Group
                    value={props.persona.genero}
                    onChange={(value) => {
                      props.setPersona({
                        ...props.persona,
                        genero: value.target.value,
                      });
                    }}
                  >
                    <Radio value="Femenino"> Femenino </Radio>
                    <Radio value="Masculino"> Masculino </Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
              {props.persona1.cargo == "1" &&
                props.persona.id_persona != props.persona1.id_persona ? (
                <Col span={24}>
                  <Form.Item label="Cargo: ">
                    <Select
                      value={props.persona.cargo}
                      style={{ width: "90%" }}
                      onChange={(value) => {
                        props.setPersona({ ...props.persona, cargo: value });
                      }}
                    >
                      <Select.Option value="1">Administrador </Select.Option>
                      <Select.Option value="2">Asistente</Select.Option>
                      <Select.Option value="3">Visitante</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
              ) : null}
            </Row>
          </Form>
        ) : (
          <Skeleton avatar active paragraph={{ rows: 4 }}></Skeleton>
        )}
      </Modal>
    </>
  );
};

export default PersonaModal;
