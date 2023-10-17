;
import { Breadcrumb } from "antd";
import { HomeOutlined } from "@ant-design/icons";

const Content = dynamic(async () => await import("antd/es/layout/layout"), { ssr: false });

const Informacion = dynamic(async () => await import("../../../components/usuarios/informacion"), { ssr: false })
const MenuSider = dynamic(async () => await import('../../../components/dashboard/MenuSider'), { ssr: false })
const Navbar = dynamic(async () => await import('../../../components/dashboard/Navbar'), { ssr: false })
const Layout = dynamic(async () => await import('antd/es/layout/layout'), { ssr: false });
import Link from "next/link";
import dynamic from "next/dynamic";
const Usuarios = () => {
  return (
    <main>
      <Layout>
        <Layout hasSider>
          <MenuSider
            defaultSelectedKey="usuario1.2"
            defaultOpenKeys={["usuario1"]}
          ></MenuSider>
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
                      href={"/dashboard/usuarios"}
                    >
                      Usuarios
                    </Link>
                  ),
                },
              ]}
            />
            <Layout>
              <Content style={{ padding: "0 50px" }}>
                <Informacion></Informacion>
              </Content>
            </Layout>
          </Content>
        </Layout>
      </Layout>
    </main>
  );
};

export default Usuarios;
