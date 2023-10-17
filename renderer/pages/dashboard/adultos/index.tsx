import { Breadcrumb } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import React from "react";
import dynamic from "next/dist/shared/lib/dynamic";

const Informacion = dynamic(async () => await import("../../../components/adultos/informacion"), { ssr: false })
const MenuSider = dynamic(async () => await import('../../../components/dashboard/MenuSider'), { ssr: false })
const Navbar = dynamic(async () => await import('../../../components/dashboard/Navbar'), { ssr: false })
const Layout = dynamic(async () => await import('antd/es/layout/layout'), {
  ssr: false,
})
const Content = dynamic(async () => await import('antd/es/layout/layout'), {
  ssr: false,
});
import Link from "next/link";

export default function NuevoCaso() {

  //cargado de casos desde la API

  return (
    <main>
      <Layout>
        <Layout hasSider>
          <MenuSider
            defaultOpenKeys={["adultos1"]}
            defaultSelectedKey="adultos1.1"
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
                      href={"/dashboard/adultos"}
                    >
                      Adultos
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
                <Informacion></Informacion>
              </Content>
            </Layout>
          </Content>
        </Layout>
      </Layout>
    </main>
  );
}
