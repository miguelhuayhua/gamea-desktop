;
import {
  Button,
  Col,
  Form,
  Image,
  Input,
  Modal,
  Popconfirm,
  Progress,
  Row,
  Skeleton,
  message,
  notification,
} from "antd";
import { NextPage } from "next";
import {
  CopyOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
} from "@ant-design/icons";

import axios from "axios";
import moment from "moment";
import { Usuario } from "./data";
import Dragger from "antd/es/upload/Dragger";
import { useState } from "react";
import { FaRegImage } from "react-icons/fa";
import bcrypt from "bcryptjs";
import { Persona } from "../personal/data";

//ROUTING

//PDF
interface Props {
  setOpen: any;
  usuario2: Usuario;
  open: boolean;
  usuario: Usuario;
  setUsuario: any;
  setUsuarios: any;
  loaded: boolean;
  setDisplayUsuarios: any;
  persona: Persona;
}
const UsuarioModal: NextPage<Props> = (props) => {
  const [progress, setProgress] = useState<{
    progress: number;
    status: any;
    message: string;
  }>({
    progress: 0,
    status: "normal",
    message: "Verificar y Crear",
  });
  const [fileList, setFileList] = useState([]);
  //control del modal
  const [file, setFile] = useState<any>(null);
  const handleConfirm = () => {
    setTimeout(() => {
      setProgress({ ...progress, progress: 80 });

      axios
        .post<{ status: number }>(process.env.BACKEND_URL + "/usuario/verify", {
          ...props.usuario,
        })
        .then(async (res) => {
          if (res.data.status == 1) {
            const formData = new FormData();
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(props.usuario.password, salt);
            formData.append("usuario", props.usuario.usuario);
            formData.append("password", hash);
            formData.append("fotografia", file);
            formData.append("id_usuario", props.usuario.id_usuario);
            formData.append("id_usuario2", props.usuario2.id_usuario);
            axios
              .post<{ status: number }>(
                process.env.BACKEND_URL + "/usuario/update",
                formData,
                {
                  headers: {
                    "Content-Type": "multipart/form-data", // Importante establecer este encabezado para el envío de FormData.
                  },
                }
              )
              .then((res) => {
                if (res.data.status == 1) {
                  notification.success({
                    message: `Usuario ${props.usuario.usuario} modificado con éxito`,
                  });
                  props.setOpen(false);
                  axios
                    .get<Usuario[]>(process.env.BACKEND_URL + "/usuario/all")
                    .then((res) => {
                      props.setUsuarios(res.data);
                      props.setDisplayUsuarios(
                        res.data.filter((value) => {
                          return value.id_usuario != props.usuario2.id_usuario;
                        })
                      );
                      setFile(null);
                      setFileList([]);
                      setProgress({
                        progress: 0,
                        message: "Verificar y Crear",
                        status: "normal",
                      });
                    });
                } else {
                  notification.error({
                    message:
                      "No se pudo modificar los datos de la persona adulta...",
                  });
                }
              });
          } else {
            setProgress({
              progress: 80,
              message: "Usuario no disponible",
              status: "exception",
            });
            notification.error({
              message: "Usuario en uso, intente con otro...",
              onClose() {
                setProgress({
                  message: "Verificar",
                  progress: 0,
                  status: "normal",
                });
              },
            });
          }
        });
    }, 500);
  };
  const handleHideModal = () => {
    props.setOpen(false);
    setFile(null);
  };

  return (
    <>
      <Modal
        key="modal"
        title={`EDITE LOS VALORES PARA EL USUARIO`}
        centered
        style={{ textAlign: "center" }}
        open={props.open}
        onCancel={() => {
          props.setOpen(false);
          setFile(null);
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
            <Button
              style={{ margin: "10px auto", width: 250 }}
              htmlType="submit"
              type="primary"
            >
              {progress.progress != 0 ? (
                <Progress
                  percent={progress.progress}
                  steps={5}
                  size="small"
                  status={progress.status}
                  strokeColor={"#FFF"}
                />
              ) : (
                <></>
              )}
              {progress.message}
            </Button>
          </Popconfirm>,
          <Button key="cancel" onClick={handleHideModal}>
            Cancelar
          </Button>,
        ]}
      >
        {props.loaded ? (
          <Row gutter={[24, 12]}>
            <Col span={12}>
              <p style={{ color: "gray", textAlign: "start" }}>
                <span>Última modifcación: </span>
                {moment(props.usuario.ult_modificacion).format(
                  "DD-MM-YYYY HH:mm:ss"
                )}
              </p>
            </Col>
            <Col span={12}>
              <p style={{ color: "gray", textAlign: "start" }}>
                <span>Persona encargada/ID: </span>
                {`${props.persona.nombres} ${props.persona.paterno} ${props.persona.materno}/${props.persona.id_persona}`}
              </p>
            </Col>
            <Col span={24} md={{ span: 12 }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <p>Imagen de Perfil:</p>
                {props.usuario.fotografia != "" ? (
                  <Image
                    alt="Foto de perfil"
                    preview={{
                      width: "80%",
                      mask: <b style={{ color: "white" }}>Ver Imagen</b>,
                    }}
                    style={{ width: 350 }}
                    src={
                      file
                        ? URL.createObjectURL(file)
                        : process.env.BACKEND_URL + props.usuario.fotografia
                    }
                  ></Image>
                ) : (
                  <></>
                )}
                <Dragger
                  height={150}
                  onRemove={() => {
                    setFile(null);
                  }}
                  multiple={false}
                  accept="image/png, image/jpeg"
                  maxCount={1}
                  customRequest={({ file: newFile, onSuccess }) => {
                    setTimeout(() => {
                      // Almacenamos el nuevo archivo seleccionado en el estado file.
                      let nuevoArchivo = newFile as File;
                      setFile(nuevoArchivo);

                      onSuccess!(null);
                      message.success(
                        `${nuevoArchivo.name} se cargó correctamente.`
                      );
                    }, 2000);
                  }}
                  fileList={fileList}
                  onChange={(ev) => {
                    setFileList(ev.fileList as any);
                  }}
                >
                  <>
                    <FaRegImage style={{ fontSize: 60 }} />
                    <p
                      style={{
                        textAlign: "center",
                        padding: "10px 20px",
                      }}
                    >
                      Seleccione una nueva fotografía para cambiar la foto de
                      perfil
                    </p>
                  </>
                </Dragger>
              </div>
            </Col>

            <Col span={24} md={{ span: 12 }}>
              <Form>
                <Row gutter={[24, 24]}>
                  <Col span={8}>
                    <b>ID del USUARIO: </b>
                    {props.usuario.id_usuario}
                    <Button
                      style={{ marginLeft: 5 }}
                      onClick={() => {
                        const textField = document.createElement("textarea");
                        textField.innerText = props.usuario.id_usuario;
                        document.body.appendChild(textField);
                        textField.select();
                        navigator.clipboard
                          .writeText(props.usuario.id_usuario)
                          .then(() => {
                            textField.remove();
                            message.success(
                              "¡ID - Usuario, copiado al portapapeles!"
                            );
                          });
                      }}
                      icon={<CopyOutlined color="blue" />}
                    ></Button>
                  </Col>
                  <Col span={24} md={{ span: 16 }}>
                    <Form.Item label="Usuario: ">
                      <Input
                        name="usuario"
                        value={props.usuario.usuario}
                        onChange={(value) =>
                          props.setUsuario({
                            ...props.usuario,
                            usuario: value.target.value,
                          })
                        }
                      />
                    </Form.Item>
                  </Col>
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
                        placeholder="Ingrese la nueva contraseña..."
                        iconRender={(visible) =>
                          visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                        }
                        onChange={(value) => {
                          props.setUsuario({
                            ...props.usuario,
                            password: value.target.value,
                          });
                        }}
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
                        className="input-style"
                        placeholder="Verifique la nueva contraseña..."
                        iconRender={(visible) =>
                          visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                        }
                        onChange={(value) => {
                          props.setUsuario({
                            ...props.usuario,
                            password: value.target.value,
                          });
                        }}
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
export default UsuarioModal;
