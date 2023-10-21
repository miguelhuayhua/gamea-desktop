;
import { Button, Col, Form, Input, InputNumber, Modal, Row, notification } from "antd";
import bcrypt from "bcryptjs";

import {
  QuestionCircleOutlined,
  CopyOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
} from "@ant-design/icons";
import { Content } from "antd/es/layout/layout";
import { Usuario } from "../usuarios/data";
import { NextPage } from "next";
import axios from "axios";
import { useState } from "react";
interface Props {
  usuario: Usuario;
  setUsuario: any;
}
const Perfil: NextPage<Props> = (props) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Modal
        title="CONFIRMAR"
        okText="Sí"
        cancelText="No"
        open={open}
        onOk={async () => {

          const salt = await bcrypt.genSalt(10);
          const hash = await bcrypt.hash(props.usuario.password, salt);
          let form = new FormData();
          form.append('id_usuario', props.usuario.id_usuario);
          form.append('usuario', props.usuario.usuario);
          form.append('password', hash);
          axios
            .post(process.env.BACKEND_URL + "/usuario/update",
              form,
            )
            .then((res) => {
              if (res.data.status == 1) {
                notification.success({
                  message:
                    "Datos personales modificados con éxito...",
                  duration: 10,

                });
                setOpen(false);
              } else {
                notification.error({
                  message: "Error en el servidor...",
                });
              }
            });
        }}
        onCancel={() => {
          setOpen(false);
        }}
      >
        <div className="column-centered">
          <QuestionCircleOutlined
            style={{ fontSize: "4em", color: "#555", marginBottom: ".5em" }}
          />
          <p className="h5 text-center">
            ¿Está seguro en realizar los cambios?
          </p>
        </div>
      </Modal>
      <Content>
        <Row>
          <Col span={16} offset={4} >
            <Form onFinish={() => {
              setOpen(true)
            }}>
              <Row gutter={[24, 24]}>

                <Col span={24}>
                  <Form.Item
                    rules={[
                      {
                        required: true,
                        message: "Por favor introduzca su contraseña",
                      },
                    ]}
                    label="Contraseña "
                    hasFeedback
                    name="pass1"
                  >
                    <Input.Password
                      className="input-style"
                      value={props.usuario.password}
                      onChange={(ev) => {
                        props.setUsuario({ ...props.usuario, password: ev.target.value })
                      }}
                      placeholder="Ingrese la nueva contraseña..."
                      iconRender={(visible) =>
                        visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                      }
                      name="p1"
                    />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item
                    rules={[
                      {
                        required: true,
                        message: "Verifique la nueva contraseña",
                      },

                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue("pass1") === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(
                            new Error("¡Las contraseñas no coinciden!")
                          );
                        },
                      }),
                    ]}
                    dependencies={["pass1"]}
                    hasFeedback
                    label="Verificar contraseña: "
                    name="pass2"
                  >
                    <Input.Password
                      name="p2"
                      className="input-style"
                      placeholder="Verifique la nueva contraseña..."
                      iconRender={(visible) =>
                        visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                      }
                    />
                  </Form.Item>
                </Col>
                <Button
                  style={{ display: "block", margin: "0 auto" }}
                  key="ok"
                  htmlType="submit"
                  type="primary"
                >
                  Aceptar y Modificar
                </Button>
              </Row>
            </Form>
          </Col>
        </Row>
      </Content>
    </>
  );
};

export default Perfil;
