;
import { Affix, Button, Menu, MenuProps } from "antd";
import "moment/locale/es";
import { useRouter } from "next/router";
//estilos
import React, { useEffect, useState } from "react";
import { MdElderly } from "react-icons//md";
import { GiInjustice } from "react-icons/gi";
import { TbReportAnalytics } from "react-icons/tb";
interface Props {
  defaultOpenKeys: string[];
  defaultSelectedKey: string;
}

type MenuItem = Required<MenuProps>["items"][number];
import MenuItem from "antd/es/menu/MenuItem";
import {
  EyeOutlined,
  PlusOutlined,
  BarChartOutlined,
  UsergroupAddOutlined,
  UserAddOutlined,
  UserOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import Image from "next/image";
import { NextPage } from "next";
import { Usuario, dataUsuario } from "../usuarios/data";
import { Persona, dataPersona } from "../personal/data";
import axios from "axios";
import Link from "next/link";
import dynamic from "next/dynamic";
const Sider = dynamic(async () => await import("antd/es/layout/Sider"), {
  ssr: false,
});
const MenuSider: NextPage<Props> = (props) => {
  const router = useRouter();
  const [items, setItems] = useState<MenuItem[]>([]);
  const [usuario, setUsuario] = useState<{
    usuario: string;
    estado: number;
    fotografia: string;
    id_persona: string;
    id_usuario: string;
  }>(dataUsuario);


  useEffect(() => {
    let id_persona = localStorage.getItem('id_persona');
    let id_usuario = localStorage.getItem('id_usuario');
    if (id_persona && id_usuario) {
      axios.post<Usuario>(process.env.BACKEND_URL + "/usuario/get", { id_usuario: id_usuario }).then(res => {
        setUsuario(res.data);
      });
      axios.post<Persona>(process.env.BACKEND_URL + "/persona/get", { id_persona: id_persona }).then(res => {
        setItems(
          res.data.cargo == "1"
            ? [
              {
                key: "dashboard",
                label: "Dashboard",
                icon: <BarChartOutlined />,
                onClick: () => {
                  router.push("/dashboard");
                },
              },
              {
                key: "caso1",
                label: "Casos",
                icon: <GiInjustice />,
                children: [
                  {
                    label: "Agregar Caso",
                    key: "caso1.1",
                    icon: <PlusOutlined />,
                    onClick: () => {
                      router.push("/dashboard/casos/nuevocaso");
                    },
                  },
                  {
                    label: "Ver Casos",
                    key: "caso1.2",
                    icon: <EyeOutlined />,
                    onClick: () => {
                      router.push("/dashboard/casos");
                    },
                  },

                  {
                    label: "Ver Denunciados",
                    key: "caso1.4",
                    icon: <EyeOutlined />,
                    onClick: () => {
                      router.push("/dashboard/denunciados");
                    },
                  },
                  {
                    key: "caso1.5",
                    label: "Reportes",
                    icon: <TbReportAnalytics />,
                    onClick: () => {
                      router.push("/dashboard/casos/reportes");
                    },
                  },
                ],
              },
              {
                label: "Personas Adultas",
                key: "adultos1",
                icon: <MdElderly></MdElderly>,
                children: [
                  {
                    label: "Ver Adultos",
                    key: "adultos1.1",
                    icon: <EyeOutlined />,
                    onClick: () => {
                      router.push("/dashboard/adultos");
                    },
                  },
                  {
                    label: "Ver Hijos",
                    key: "adultos1.2",
                    icon: <EyeOutlined />,
                    onClick: () => {
                      router.push("/dashboard/hijos");
                    },
                  },
                  {
                    key: "adultos1.3",
                    label: "Reportes",
                    icon: <TbReportAnalytics />,
                    onClick: () => {
                      router.push("/dashboard/adultos/reportes");
                    },
                  },
                ],
              },

              {
                key: "personal",
                label: "Personal",
                icon: <TeamOutlined />,
                children: [
                  {
                    label: "Registrar Personal",
                    key: "personal1.1",
                    icon: <UsergroupAddOutlined />,
                    onClick: () => {
                      router.push("/dashboard/personal/agregar");
                    },
                  },
                  {
                    label: "Ver Personal",
                    key: "personal1.2",
                    icon: <EyeOutlined />,
                    onClick: () => {
                      router.push("/dashboard/personal");
                    },
                  }

                ],
              },
              {
                label: "Usuarios",
                key: "usuario1",
                icon: <UserOutlined />,
                children: [
                  {
                    label: "Registrar Usuario",
                    key: "usuario1.1",
                    icon: <UserAddOutlined />,
                    onClick: () => {
                      router.push("/dashboard/usuarios/agregar");
                    },
                  },
                  {
                    label: "Ver Usuarios",
                    key: "usuario1.2",
                    icon: <EyeOutlined />,
                    onClick: () => {
                      router.push("/dashboard/usuarios");
                    },
                  },

                ],
              },
            ]
            : [
              {
                key: "dashboard",
                label: "Dashboard",
                icon: <BarChartOutlined />,
                onClick: () => {
                  router.push("/dashboard");
                },
              },
              {
                key: "caso1",
                label: "Casos",
                icon: <GiInjustice />,
                children: [
                  {
                    label: "Agregar Caso",
                    key: "caso1.1",
                    icon: <PlusOutlined />,
                    onClick: () => {
                      router.push("/dashboard/casos/nuevocaso");
                    },
                  },
                  {
                    label: "Ver Casos",
                    key: "caso1.2",
                    icon: <EyeOutlined />,
                    onClick: () => {
                      router.push("/dashboard/casos");
                    },
                  },

                  {
                    label: "Ver Denunciados",
                    key: "caso1.4",
                    icon: <EyeOutlined />,
                    onClick: () => {
                      router.push("/dashboard/denunciados");
                    },
                  },
                  {
                    key: "caso1.5",
                    label: "Reportes",
                    icon: <TbReportAnalytics />,
                    onClick: () => {
                      router.push("/dashboard/casos/reportes");
                    },
                  },
                ],
              },
              {
                label: "Personas Adultas",
                key: "adultos1",
                icon: <MdElderly></MdElderly>,
                children: [
                  {
                    label: "Ver Adultos",
                    key: "adultos1.1",
                    icon: <EyeOutlined />,
                    onClick: () => {
                      router.push("/dashboard/adultos");
                    },
                  },
                  {
                    label: "Ver Hijos",
                    key: "adultos1.2",
                    icon: <EyeOutlined />,
                    onClick: () => {
                      router.push("/dashboard/hijos");
                    },
                  },
                  {
                    key: "adultos1.3",
                    label: "Reportes",
                    icon: <TbReportAnalytics />,
                    onClick: () => {
                      router.push("/dashboard/adultos/reportes");
                    },
                  },
                ],
              },
            ]
        );
      })
    }

  }, []);


  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      <Affix>
        <Sider
          breakpoint="md"

          collapsible
          width={250}
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
          defaultCollapsed={true}
          style={{
            overflow: "auto",
            height: "100vh",
            width: 200,
            position: "sticky",
            left: 0,
            backgroundColor: "#FEFEFE",
            zIndex: 100,
            boxShadow: "0 0 10px #2BC4F144",
          }}

        >
          <Link
            href={"/dashboard"}
            style={{
              textDecoration: "None",
              textAlign: "center",
              fontWeight: "bold",
              color: "#1AB2C0",
              fontSize: 12,
            }}
          >
            <div style={{ width: "70%", margin: "20px auto", fontWeight: 'bold', textAlign: 'center', fontSize: 11, marginTop: 10 }}>
              <Image
                layout="responsive"
                width={100}
                height={60}
                src={"/assets/logo-gamea.png"}
                style={{ marginBottom: 5 }}
              ></Image>
              UNIDAD
              <br />
              ADULTOS MAYORES
            </div>
          </Link>
          <Menu
            selectedKeys={[props.defaultSelectedKey]}
            mode="inline"
            defaultOpenKeys={props.defaultOpenKeys}
            items={items}
            style={{ backgroundColor: "#FEFEFE" }}

          />
        </Sider>
      </Affix>
    </>
  );
};

export default MenuSider;
