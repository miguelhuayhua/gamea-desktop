;
import { Breadcrumb, FloatButton, Tabs, TabsProps } from "antd";
import { useEffect, useState } from "react";
import { HomeOutlined, } from "@ant-design/icons";
import axios from "axios";
import {
  Caso,
  Citacion,
  Denunciado,
  Seguimiento,
  dataCitacion,
  dataSeguimiento,
  datosCaso,
} from "../../../../components/casos/data";
import { Adulto, dataAdulto } from "../../../../components/adultos/data";
import { Persona, dataPersona } from "../../../../components/personal/data";
const SeguimientoOptions = dynamic(async () => await import("../../../../components/casos/accion/seguimiento"), { ssr: false })
const CitacionOptions = dynamic(async () => await import("../../../../components/casos/accion/citacion"), { ssr: false })
const ModalActaCompromiso = dynamic(async () => await import("../../../../components/casos/accion/acta-compromiso"), { ssr: false })

import { Hijo } from "../../../../components/hijos/data";
import { BiHappyAlt } from "react-icons/bi";
import { dataDenunciado } from "../../../../components/denunciados/data";
import Link from "next/link";
import { Usuario, dataUsuario } from "../../../../components/usuarios/data";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
const Content = dynamic(async () => await import('antd/es/layout/layout'), {
  ssr: false,
});
const MenuSider = dynamic(async () => await import('../../../../components/dashboard/MenuSider'), { ssr: false })
const Navbar = dynamic(async () => await import('../../../../components/dashboard/Navbar'), { ssr: false })
const Layout = dynamic(async () => await import('antd/es/layout/layout'), { ssr: false });
const AccionCaso = () => {
  const [persona, setPersona] = useState<Persona>(dataPersona);
  const [adulto, setAdulto] = useState<Adulto>(dataAdulto);
  const [caso, setCaso] = useState<Caso>(datosCaso);
  const [citaciones, setCitaciones] = useState<Citacion[]>([]);
  const [denunciado, setDenunciado] = useState<Denunciado>(dataDenunciado);
  const [loaded, setLoaded] = useState(false);
  const [open, setOpen] = useState(false);
  const [citacion, setCitacion] = useState<{
    citacion: Citacion;
    size: number;
  }>({ citacion: dataCitacion, size: 0 });
  const [seguimiento, setSeguimiento] = useState<Seguimiento>(dataSeguimiento);
  const [usuario, setUsuario] = useState<Usuario>(dataUsuario);
  const router = useRouter();
  useEffect(() => {
    let id_persona = localStorage.getItem('id_persona');
    let id_usuario = localStorage.getItem('id_usuario');
    if (id_persona && id_usuario) {
      axios.post<Usuario>(process.env.BACKEND_URL + "/usuario/get", { id_usuario: id_usuario }).then(res => {
        setUsuario(res.data);
      });
      axios.post<Persona>(process.env.BACKEND_URL + "/persona/get", { id_persona: id_persona }).then(res => {
        setPersona(persona);
      });
      axios
        .post<Caso>(process.env.BACKEND_URL + "/caso/get", {
          id_caso: router.query.id_caso
        })

        .then((res) => {
          if (res.data) {
            axios
              .post<Denunciado>(process.env.BACKEND_URL + "/denunciado/get", {
                id_caso: res.data.id_caso,
              })
              .then((res) => {
                setDenunciado(res.data);
              });

            setCaso(res.data);
            axios
              .post<{ adulto: Adulto; hijos: Hijo[] }>(
                process.env.BACKEND_URL + "/adulto/get",
                {
                  id_adulto: res.data.id_adulto,
                }
              )
              .then((res) => {
                setAdulto({
                  ...res.data.adulto,
                  hijos: res.data.hijos,
                  expedido: "",
                });
                setLoaded(true);
              });
            axios
              .post<Citacion[]>(
                process.env.BACKEND_URL + "/caso/citacion/all",
                {
                  id_caso: router.query.id_caso
                }
              )
              .then((res) => {
                setCitaciones(res.data);
                setCitacion({ ...citacion, size: res.data.length });
              });
          } else {
            router.back();
          }
        });
    }
  }, []);

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: `Seguimientos`,
      children: (
        <SeguimientoOptions
          usuario={usuario}
          setSeguimiento={setSeguimiento}
          seguimiento={seguimiento}
          adulto={adulto}
          persona={persona}
          caso={caso}
        ></SeguimientoOptions>
      ),
    },
    {
      key: "2",
      label: `Citaciones`,
      children: (
        <CitacionOptions
          usuario={usuario}
          adulto={adulto}
          caso={caso}
          persona={persona}
          citaciones={citaciones}
          citacion={citacion}
          setCitacion={setCitacion}
          setCitaciones={setCitaciones}
        ></CitacionOptions>
      ),
    },
  ];

  return (
    <main>
      <Layout>
        <Layout hasSider>
          <MenuSider defaultOpenKeys={[""]} defaultSelectedKey=""></MenuSider>
          <Content>
            <Navbar></Navbar>
            <Breadcrumb
              separator={<b style={{ fontSize: 18 }}>/</b>}
              className="mx-4 my-2"
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
                      href={"/dashboard/casos"}
                    >
                      Casos
                    </Link>
                  ),
                },
                {
                  title: (
                    <Link
                      style={{ marginTop: 2.5, fontSize: 15 }}
                      href={
                        "/dashboard/casos/accion?id_caso=" +
                        router.query.id_caso
                      }
                    >
                      {router.query.id_caso}
                    </Link>
                  ),
                },
              ]}
            />
            <Layout>
              <Content
                className="site-layout"
                style={{ padding: "0 50px", position: "relative" }}
              >
                <Tabs
                  size="small"
                  style={{ marginTop: 20 }}
                  tabPosition="left"
                  defaultActiveKey="1"
                  items={items}
                />
              </Content>
            </Layout>
          </Content>
        </Layout>
      </Layout>
      <FloatButton
        tooltip={<p>Generar acta de compromiso</p>}
        onClick={() => {
          setOpen(true);
        }}
        icon={<BiHappyAlt style={{ scale: 1.8 }} />}
        type="primary"
        style={{ width: 70, height: 70, fontSize: 30 }}
      ></FloatButton>

      <ModalActaCompromiso
        usuario={usuario}
        setDenunciado={setDenunciado}
        adulto={adulto}
        caso={caso}
        loaded={loaded}
        open={open}
        persona={persona}
        setOpen={setOpen}
        denunciado={denunciado}
      ></ModalActaCompromiso>
    </main>
  );
};

export default AccionCaso;
