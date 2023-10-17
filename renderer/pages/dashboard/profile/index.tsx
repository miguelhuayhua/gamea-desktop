;
import {
  Avatar,
  Breadcrumb,
  Button,
  Card,
  Col,
  Row,
  Tabs,
  TabsProps,
  Typography,
  Upload,
  message,
  notification,
} from "antd";
import { AiFillEdit } from "react-icons/ai";
import React, { useEffect, useState } from "react";
import { Usuario, dataUsuario } from "../../../components/usuarios/data";
import { Persona, dataPersona } from "../../../components/personal/data";
import { HomeOutlined } from "@ant-design/icons";
import Link from "next/link";
import axios from "axios";
import { AccesoUsuario, AccionesUsuario } from "../../../components/profile/data";
const SeguimientoCuenta = dynamic(async () => await import("../../../components/profile/seguimiento-cuenta"), { ssr: false });
const Perfil = dynamic(async () => await import("../../../components/profile/perfil"), { ssr: false });
const DatosPersonales = dynamic(async () => await import("../../../components/profile/datos-personales"), { ssr: false });
import dynamic from "next/dynamic";
const Content = dynamic(async () => await import('antd/es/layout/layout'), {
  ssr: false,
});
const MenuSider = dynamic(async () => await import('../../../components/dashboard/MenuSider'), { ssr: false })
const Navbar = dynamic(async () => await import('../../../components/dashboard/Navbar'), { ssr: false })
const Layout = dynamic(async () => await import('antd/es/layout/layout'), { ssr: false });
export default function Profile() {
  const [usuario, setUsuario] = useState<Usuario>(dataUsuario);
  const [accionesUsuario, setAccionesUsuario] = useState<AccionesUsuario[]>([]);
  const [accesosUsuario, setAccesosUsuario] = useState<{
    horas: number;
    accesos_usuario: AccesoUsuario[];
  }>({ horas: 0, accesos_usuario: [] });
  const [displayAccionesUsuario, setDisplayAccionesUsuario] = useState<AccionesUsuario[]>([]);
  const [displayAccesosUsuario, setDisplayAccesosUsuario] = useState<AccesoUsuario[]>([]);
  const [file, setFile] = useState<any>(null);

  const [persona, setPersona] = useState<Persona>(dataPersona);

  useEffect(() => {

    let id_persona = localStorage.getItem('id_persona');
    let id_usuario = localStorage.getItem('id_usuario');
    if (id_persona && id_usuario) {
      axios.post<Usuario>(process.env.BACKEND_URL + "/usuario/get", { id_usuario: id_usuario }).then(res => {
        setUsuario({ ...res.data });
      });
      axios.post<Persona>(process.env.BACKEND_URL + "/persona/get", { id_persona: id_persona }).then(res => {
        setPersona(res.data);
      });
      axios
        .post<AccionesUsuario[]>(
          process.env.BACKEND_URL + "/usuario/getAccionesById",
          {
            id_usuario: id_usuario,
          }
        )
        .then((res) => {
          setAccionesUsuario(res.data);
          setDisplayAccionesUsuario(res.data)
          axios
            .post<{ horas: number; accesos_usuario: AccesoUsuario[] }>(
              process.env.BACKEND_URL + "/usuario/getAccesosById",
              {
                id_usuario: id_usuario,
              }
            )
            .then((res) => {
              setAccesosUsuario(res.data);
              setDisplayAccesosUsuario(res.data.accesos_usuario)
            });
        });
    }
  }, []);

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Datos Personales",
      children: (
        <DatosPersonales
          setPersona={setPersona}
          persona={persona}
        ></DatosPersonales>
      ),
    },
    {
      key: "2",
      label: "Seguridad",
      children: <Perfil setUsuario={setUsuario} usuario={usuario}></Perfil>,
    },
    {
      key: "3",
      label: "Seguimiento de cuenta",
      children: (
        <SeguimientoCuenta
          accesosUsuario={accesosUsuario.accesos_usuario}
          accionesUsuario={accionesUsuario}
          persona={persona}
          displayAccionesUsuario={displayAccionesUsuario}
          displayAccesosUsuario={displayAccesosUsuario}
          setDisplayAccionesUsuario={setDisplayAccionesUsuario}
          setDisplayAccesosUsuario={setDisplayAccesosUsuario}

        ></SeguimientoCuenta>
      ),
    },
  ];
  return (
    <main>
      <Layout>
        <Layout hasSider>
          <MenuSider
            defaultOpenKeys={["none"]}
            defaultSelectedKey="none"
          ></MenuSider>
          <Content>
            <Navbar></Navbar>
            <h3>Editar Perfil</h3>
            <Breadcrumb
              separator={<b style={{ fontSize: 18 }}>/</b>}
              className="mx-4 my-1"
              items={[
                {
                  href: "/dashboard",
                  title: <HomeOutlined />,
                },
                {
                  title: (
                    <Link
                      style={{ marginTop: 2.5, fontSize: 15 }}
                      href={"/dashboard"}
                    >
                      Dashboard
                    </Link>
                  ),
                },
                {
                  title: (
                    <Link
                      style={{ marginTop: 2.5, fontSize: 15 }}
                      href={"/dashboard/profile"}
                    >
                      Editar Perfil
                    </Link>
                  ),
                },
              ]}
            />
            <Layout>
              <Content
                className="site-layout mt-4"
                style={{ padding: "0 20px" }}
              >
                <Row>
                  <Col span={24} style={{ position: "relative" }}>
                    <div className="banner-container"></div>
                    <Card style={{ marginTop: 200 }}>
                      <Row>
                        <Col
                          span={24}
                          lg={{ span: 8 }}
                          style={{ position: "relative" }}
                        >
                          <div style={{ position: "absolute", top: -80 }}>
                            <Upload
                              name="avatar"
                              listType="picture-circle"
                              showUploadList={false}
                              multiple={false}
                              accept="image/png, image/jpeg"
                              maxCount={1}
                              customRequest={({ file: newFile, onSuccess }) => {
                                setTimeout(() => {
                                  // Almacenamos el nuevo archivo seleccionado en el estado file.
                                  let nuevoArchivo = newFile as File;
                                  setFile(nuevoArchivo);
                                  let form = new FormData();
                                  form.append("fotografia", nuevoArchivo);
                                  form.append("id_usuario", usuario.id_usuario);
                                  axios
                                    .post(
                                      process.env.BACKEND_URL +
                                      "/usuario/fotografia",
                                      form,
                                      {
                                        headers: {
                                          "Content-Type": "multipart/form-data",
                                        },
                                      }
                                    )
                                    .then((res) => {
                                      if (res.data.status == 1) {
                                        message.success(
                                          `${nuevoArchivo.name} se cargó correctamente.`
                                        );
                                        notification.success({
                                          message:
                                            "La foto de perfil se actualizó correctamente, INICIE SESIÓN NUEVAMENTE...",
                                          duration: 10,
                                          btn: (
                                            <>
                                              <Button
                                                onClick={() => {
                                                  localStorage.clear();
                                                }}
                                              >
                                                Cerrar Sesión
                                              </Button>
                                            </>
                                          ),

                                        });
                                      }
                                    });

                                  onSuccess!(null);
                                }, 2000);
                              }}
                            >
                              <div className="file-uploader">
                                <AiFillEdit className="icon" />
                              </div>
                              <Avatar
                                src={
                                  file == null
                                    ? process.env.BACKEND_URL +
                                    usuario.fotografia
                                    : URL.createObjectURL(file)
                                }
                                style={{
                                  width: 100,
                                  height: 100,
                                  zIndex: 1
                                }}
                              ></Avatar>
                            </Upload>
                          </div>
                          <div className="mt-4">
                            <span style={{ fontSize: 18, fontWeight: "bold", color: "#0c7fa1" }}>
                              Nombre de Usuario:
                            </span>
                            <div className="d-flex">
                              <Typography.Title
                                editable={{
                                  icon: <AiFillEdit />,
                                  tooltip: "Editar ",
                                  onChange(value) {
                                    setUsuario({ ...usuario, usuario: value });
                                  },
                                  text: usuario.usuario,
                                }}
                                level={4}
                                style={{ fontWeight: "normal" }}
                              >
                                {`${usuario.usuario}`}
                              </Typography.Title>
                              <Button
                                style={{ marginLeft: 10, height: 30 }}
                                onClick={() => {
                                  axios
                                    .post(
                                      process.env.BACKEND_URL +
                                      "/usuario/username",
                                      {
                                        id_usuario: usuario.id_usuario,
                                        usuario: usuario.usuario,
                                      }
                                    )
                                    .then((res) => {
                                      if (res.data.status == 1) {
                                        notification.success({
                                          message: res.data.message,
                                          duration: 10,
                                          btn: (
                                            <>
                                              <Button
                                                onClick={() => {
                                                  localStorage.clear();
                                                }}
                                              >
                                                Cerrar Sesión
                                              </Button>
                                            </>
                                          ),
                                        });
                                      } else {
                                        notification.warning({
                                          message: res.data.message,
                                        });
                                      }
                                    });
                                }}
                              >
                                Aceptar
                              </Button>
                            </div>
                          </div>
                        </Col>
                        <Col offset={0} span={24} lg={{ span: 10, offset: 4 }} className="d-flex">
                          <div className="counters">
                            <p>Acciones de Usuario</p>
                            <span>
                              {accionesUsuario.length} ACCIONES
                            </span>
                          </div>
                          <div className="counters" style={{ borderLeft: "1px solid gray", borderRight: "1px solid gray" }}>
                            <p>Nro. de Inicios de Sesión</p>
                            <span>
                              {accesosUsuario.accesos_usuario.length}{" "}
                              INICIOS
                            </span>
                          </div>
                          <div className="counters">
                            <p>Horas dentro del sistema</p>
                            <span>
                              {accesosUsuario.horas
                                ? -(accesosUsuario.horas / 60 / 60).toFixed(2)
                                : "0"}{" "}
                              HORAS
                            </span>
                          </div>

                        </Col>

                      </Row>
                    </Card>
                  </Col>
                  <Col span={24}>
                    <Card className="mt-3">
                      <Tabs defaultActiveKey="1" items={items} />

                    </Card>
                  </Col>
                </Row>
              </Content>
            </Layout>
          </Content>
        </Layout>
      </Layout>
    </main>
  );
}
