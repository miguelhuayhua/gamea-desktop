;
import {
  Avatar,
  Breadcrumb,
  Button,
  Card,
  Col,
  FloatButton,

  List,
  Progress,
  Row,
  Tooltip,
} from "antd";
import "moment/locale/es";
//estilos

import React, { useEffect, useState } from "react";
import { HomeOutlined } from "@ant-design/icons";
import { CgHello } from "react-icons/cg";
import GraficoPastel from "../graficos/Pastel";
import { FaBalanceScaleLeft } from "react-icons/fa";
import {
  MdCallReceived,
  MdOutlineElderlyWoman,
  MdOutlineVerticalAlignTop,
} from "react-icons/md";
const Layout = dynamic(async () => await import('antd/es/layout/layout'), {
  ssr: false,
})
const Content = dynamic(async () => await import('antd/es/layout/layout'), {
  ssr: false,
});
const MenuSider = dynamic(async () => await import('./MenuSider'), { ssr: false })
const Navbar = dynamic(async () => await import('./Navbar'), { ssr: false })

import GraficoLinea from "../graficos/Linea";
import { AiFillEye } from "react-icons/ai";
import { BsFillArrowUpCircleFill } from "react-icons/bs";
import { PiListMagnifyingGlassFill } from "react-icons/pi";
import { GrView } from "react-icons/gr";
import {
  AiOutlineDash,
  AiOutlinePlus,
  AiOutlinePlusCircle,
} from "react-icons/ai";
import GraficoBarra from "../graficos/Barra";
import Link from "next/link";
import dayjs from "dayjs";
import { meses } from "../casos/nuevocaso/data";
import axios from "axios";
import { Caso } from "../casos/data";
import GraficoBarraHorizontal from "../graficos/BarraHorizontal";
import { Usuario, dataUsuario } from "../usuarios/data";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState<{
    acciones_x_casos: { accion: string[]; cantidad: number[] };
    caso_x_distrito: { distrito: number[]; cantidad: number[] };
    casos_x_dia: number;
    rango_edades: { rango_edades: string[]; cantidad: number[] };
    casos_x_mes_actual: number;
    suspendidos_x_mes: number;
    citaciones_x_mes: number;
    casos_x_mes: { mes: number[]; cantidad: number[] };
    casos_x_genero: { genero: string[]; cantidad: number[] };
    proximas_citaciones: {
      id_citacion: string;
      fecha_citacion: string;
      id_caso: string;
    }[];
    conteo_tipologia: {
      tipologia: string[];
      cantidad: number[];
    };
  }>();
  const [casos, setCasos] = useState<Caso[]>([]);
  const [usuario, setUsuario] = useState<{
    usuario: string;
    estado: number;
    fotografia: string;
    id_persona: string;
    id_usuario: string;
  }>(dataUsuario);
  const router = useRouter();

  useEffect(() => {
    let id_persona = localStorage.getItem('id_persona');
    let id_usuario = localStorage.getItem('id_usuario');
    if (id_persona && id_usuario) {
      axios.post<Usuario>(process.env.BACKEND_URL + "/usuario/get", { id_usuario: id_usuario }).then(res => {
        setUsuario(res.data);
        axios.get(process.env.BACKEND_URL + "/charts/dashboard").then((res) => {
          setDashboardData(res.data);
        });
        axios.get<Caso[]>(process.env.BACKEND_URL + "/caso/all").then((res) => {
          let casosLimitados = res.data.slice(0, 4);
          setCasos(casosLimitados);
        });
      })
    }
  }, []);

  return (
    <main>
      <Layout>
        <Layout hasSider>
          <MenuSider
            defaultSelectedKey="dashboard"
            defaultOpenKeys={[]}
          ></MenuSider>
          <Content style={{ backgroundColor: "#f4f7fa" }}>
            <Navbar></Navbar>
            <Layout style={{ backgroundColor: "#f4f7fa" }}>
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
                ]}
              />
              <Content className="px-4">
                <Row gutter={[20, 10]}>
                  <Col span={24}>
                    <Row>
                      <Col
                        span={24}
                        lg={{ span: 8 }}
                        className="vertical-center"
                      >
                        <CgHello
                          style={{ margin: "0 10px" }}
                          color="#36bbc7"
                          fontSize={35}
                        />
                        <span style={{ fontSize: 18, color: "GrayText" }}>
                          Hola {usuario.usuario}, me alegra verte hoy...
                        </span>
                      </Col>
                      <Col span={24} offset={0} lg={{ span: 8, offset: 6 }}>
                        <div className="d-flex my-2 justify-content-around">
                          <Link
                            className="custom-btn-dash"
                            href={"/dashboard/casos"}
                          >
                            <Button
                              style={{ height: 60 }}
                              className="vertical "
                            >
                              <AiFillEye fontSize={40} />
                              <p>Ver casos</p>
                            </Button>
                          </Link>
                          <Link
                            className="custom-btn-dash"
                            href={"/dashboard/adultos"}
                          >
                            <Button style={{ height: 60 }} className="vertical">
                              <MdOutlineElderlyWoman fontSize={40} />
                              <p>Ver Adultos</p>
                            </Button>
                          </Link>
                          <Link
                            className="custom-btn-dash"
                            href={"/dashboard/casos/nuevocaso"}
                          >
                            <Button style={{ height: 60 }} className="vertical">
                              <AiOutlinePlusCircle
                                size={40}
                                className="vertical-center"
                              />
                              <p>Nuevo Caso</p>
                            </Button>
                          </Link>
                        </div>
                      </Col>
                    </Row>
                  </Col>
                  <Col span={24}>
                    <Row gutter={[24, 24]}>
                      <Col span={24} lg={{ span: 8 }}>
                        <Card
                          title={
                            <p style={{ fontSize: 14 }}>
                              {"DENUNCIAS DE ESTE MES (" +
                                meses[dayjs().month()].toUpperCase() +
                                ")"}
                            </p>
                          }
                          bordered={false}
                        >
                          <Row>
                            <Col span={18} className="vertical-center">
                              {dashboardData?.casos_x_mes_actual == 0 ? (
                                <AiOutlineDash size={30} className="mx-3" />
                              ) : (
                                <BsFillArrowUpCircleFill
                                  size={30}
                                  className="mx-3"
                                  color="#52c41a"
                                />
                              )}
                              <span className="card-text">
                                {dashboardData?.casos_x_mes_actual +
                                  " DENUNCIAS"}
                              </span>
                            </Col>
                            <Col span={6} className="vertical-center">
                              <span
                                className="card-text"
                                style={{ color: "gray", display: 'block', textAlign: 'center' }}
                              >
                                <AiOutlinePlus color="gray" size={20} />

                                {`${dashboardData?.casos_x_dia} (${dashboardData?.casos_x_mes_actual != 0
                                  ? (dashboardData?.casos_x_dia! * 100) /
                                  dashboardData?.casos_x_mes_actual!
                                  : 0
                                  }%)`}
                              </span>
                            </Col>
                          </Row>
                        </Card>
                      </Col>
                      <Col span={24} lg={{ span: 8 }}>
                        <Card
                          title={
                            <p style={{ fontSize: 14 }}>
                              {"AUDIENCIAS SUSPENDIDAS MES (" +
                                meses[dayjs().month()] +
                                ")"}
                            </p>
                          }
                          bordered={false}
                        >
                          <Row>
                            <Col span={22}>
                              {dashboardData?.suspendidos_x_mes == 0 ? (
                                <AiOutlineDash size={30} className="mx-3" />
                              ) : (
                                <BsFillArrowUpCircleFill
                                  size={30}
                                  className="mx-3"
                                />
                              )}
                              <span className="card-text">
                                {dashboardData?.suspendidos_x_mes +
                                  " SUSPENCIONES"}
                              </span>
                            </Col>
                          </Row>
                        </Card>
                      </Col>
                      <Col span={24} lg={{ span: 8 }}>
                        <Card
                          title={
                            "TOTAL CITACIONES MES  " +
                            meses[dayjs().month()].toUpperCase()
                          }
                          bordered={false}
                        >
                          <Row>
                            <Col span={22}>
                              {dashboardData?.citaciones_x_mes == 0 ? (
                                <AiOutlineDash size={30} className="mx-3" />
                              ) : (
                                <BsFillArrowUpCircleFill
                                  size={30}
                                  className="mx-3"
                                  color="#52c41a"
                                />
                              )}
                              <span className="card-text">
                                {dashboardData?.citaciones_x_mes +
                                  " citaciones"}
                              </span>
                            </Col>
                          </Row>
                          <Col span={24}>
                            <Tooltip
                              title={`${dashboardData?.suspendidos_x_mes == 0
                                ? dashboardData.suspendidos_x_mes
                                : (dashboardData?.suspendidos_x_mes! * 100) /
                                dashboardData?.citaciones_x_mes!
                                }% citaciones suspendidas / ${dashboardData?.citaciones_x_mes == 0
                                  ? dashboardData.citaciones_x_mes
                                  : 100 -
                                  (dashboardData?.suspendidos_x_mes! * 100) /
                                  dashboardData?.citaciones_x_mes!
                                }% citaciones en proceso`}
                            >
                              <Progress
                                status="normal"
                                percent={100}
                                strokeColor={{
                                  "0%": "#1982a1",
                                  "100%": "#1982a1",
                                }}
                                format={() => ""}
                                success={{
                                  percent:
                                    dashboardData?.citaciones_x_mes == 0
                                      ? dashboardData.citaciones_x_mes
                                      : 100 -
                                      (dashboardData?.suspendidos_x_mes! *
                                        100) /
                                      dashboardData?.citaciones_x_mes!,
                                  strokeColor: "red",
                                }}
                              />{" "}
                            </Tooltip>
                          </Col>
                        </Card>
                      </Col>
                      <Col span={24} lg={{ span: 8 }}>
                        <Card
                          title="NÚMERO DE CASOS POR GÉNERO"
                          bordered={false}
                        >
                          <GraficoBarra
                            data={dashboardData?.casos_x_genero.cantidad}
                            keys={dashboardData?.casos_x_genero.genero}
                            keyTitle="Genero"
                            colors={["#1982A1", "#AF1E28"]}
                          ></GraficoBarra>
                        </Card>
                      </Col>
                      <Col span={24} lg={{ span: 16 }}>
                        <Card
                          title={
                            "CANTIDAD DE CASOS POR MES - " + dayjs().year()
                          }
                          bordered={false}
                        >
                          <GraficoLinea
                            data={dashboardData?.casos_x_mes.cantidad}
                            keys={dashboardData?.casos_x_mes.mes.map(
                              (value) => {
                                return meses[value - 1];
                              }
                            )}
                            keyTitle="Mes"
                          ></GraficoLinea>
                        </Card>
                      </Col>
                      <Col span={24} lg={{ span: 8 }}>
                        <Card
                          title="ÚLTIMOS CASOS AÑADIDOS"
                          extra={
                            <Button
                              style={{ height: 40 }}
                              onClick={() => {
                                router.push("/dashboard/casos/nuevocaso");
                              }}
                            >
                              <AiOutlinePlusCircle
                                size={24}
                                className="vertical-center"
                              />
                            </Button>
                          }
                          bordered={false}
                        >
                          <List
                            itemLayout="horizontal"
                            dataSource={casos}
                            renderItem={(item, index) => (
                              <List.Item
                                actions={[
                                  <Tooltip
                                    key={index + "t"}
                                    title="Entrar al caso"
                                  >
                                    <Link
                                      href={`/dashboard/casos/accion?id_caso=${item.id_caso}`}
                                    >
                                      <Button>
                                        <GrView />
                                      </Button>
                                    </Link>
                                  </Tooltip>,
                                ]}
                              >
                                <List.Item.Meta
                                  avatar={
                                    <Avatar
                                      className="center"
                                      style={{ backgroundColor: "#AF1E28" }}
                                      icon={
                                        <FaBalanceScaleLeft
                                          style={{ backgroundColor: "" }}
                                        />
                                      }
                                    />
                                  }
                                  title={
                                    <Link
                                      href={`/dashboard/casos/accion?id_caso=${item.id_caso}`}
                                    >
                                      {item.nro_caso}
                                    </Link>
                                  }
                                  description={
                                    <>
                                      <p>{`Caso que inició el ${item.fecha_registro}`}</p>
                                      <p>Tipología: {item.tipologia}</p>
                                    </>
                                  }
                                />
                              </List.Item>
                            )}
                          />
                        </Card>
                      </Col>
                      <Col span={24} lg={{ span: 8 }}>
                        <Card
                          title={
                            <>
                              <Row className="py-4">
                                <Col span={4}>
                                  <MdCallReceived color="#1677ff" size={40} />
                                </Col>
                                <Col span={20}>
                                  <span style={{ fontSize: 20, color: "gray" }}>
                                    Total:{" "}
                                    {dashboardData?.proximas_citaciones.length}
                                  </span>
                                  <p style={{ fontSize: 16 }}>
                                    Citaciones para los próximos 7 días
                                  </p>
                                </Col>
                              </Row>
                            </>
                          }
                          bordered={false}
                        >
                          <List
                            locale={{
                              emptyText: (
                                <>
                                  <PiListMagnifyingGlassFill
                                    width={50}
                                    height={50}
                                    fontSize={50}
                                  />
                                  <p>Sin citaciones cercanas...</p>
                                </>
                              ),
                            }}
                            dataSource={dashboardData?.proximas_citaciones}
                            renderItem={(item, index) => (
                              <List.Item
                                actions={[
                                  <Tooltip
                                    key={index + "to"}
                                    title="Entrar al caso"
                                  >
                                    <Link
                                      key={index + "i"}
                                      href={`/dashboard/casos/accion?id_caso=${item.id_caso}`}
                                    >
                                      <Button>
                                        <GrView />
                                      </Button>
                                    </Link>
                                  </Tooltip>,
                                ]}
                              >
                                <List.Item.Meta
                                  avatar={
                                    <Avatar
                                      style={{ backgroundColor: "#1677ff" }}
                                      icon={<FaBalanceScaleLeft />}
                                    />
                                  }
                                  title={
                                    <Link
                                      href={`/dashboard/casos/accion?id_caso=${item.id_caso}`}
                                    >
                                      <p>{`Para el ${item.fecha_citacion}`}</p>
                                    </Link>
                                  }
                                />
                              </List.Item>
                            )}
                          />
                        </Card>
                      </Col>
                      <Col span={24} lg={{ span: 8 }}>
                        <Card
                          title="Histograma de edades - denuncia"
                          bordered={false}
                        >
                          <GraficoBarra
                            data={dashboardData?.rango_edades.cantidad}
                            keyTitle="Edad"
                            keys={dashboardData?.rango_edades.rango_edades}
                          />
                        </Card>
                      </Col>
                      <Col span={24} lg={{ span: 12 }}>
                        <Card
                          title="Cantidad de caso por tipologías"
                          bordered={false}
                        >
                          <GraficoBarraHorizontal
                            data={dashboardData?.conteo_tipologia.cantidad}
                            keyTitle="Tipologia"
                            keys={dashboardData?.conteo_tipologia.tipologia}
                          />
                        </Card>
                      </Col>
                      <Col span={24} lg={{ span: 12 }}>
                        <Card
                          title="Cantidad de acciones tomadas"
                          bordered={false}
                        >
                          <GraficoPastel
                            data={dashboardData?.acciones_x_casos.cantidad}
                            keyTitle="name"
                            keys={dashboardData?.acciones_x_casos.accion}
                          ></GraficoPastel>
                        </Card>
                      </Col>

                    </Row>
                  </Col>
                </Row>
              </Content>
            </Layout>
            <FloatButton.BackTop
              className="float-btn"
              icon={<MdOutlineVerticalAlignTop />}
            />
          </Content>
        </Layout>
      </Layout>
    </main>
  );
}
