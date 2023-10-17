;
import { Button, Col, Input, InputNumber, List, Modal, Row, Select, Tooltip, notification } from "antd";
//estilos
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Caso } from "../../../../components/casos/data";
import { Persona, dataPersona } from "../../../../components/personal/data";
import { AdultoMayor2, dataDatosGenerales } from "../../../../components/casos/nuevocaso/data";
//iconos
import { HiIdentification } from 'react-icons/hi';
import { MdDriveFileRenameOutline } from 'react-icons/md';
import { pdf } from "@react-pdf/renderer";
import { Hijo } from "../../../../components/hijos/data";
import ReporteAdulto from "../../../../components/adultos/reportes/reporte";
import dynamic from "next/dynamic";

const Layout = dynamic(async () => await import('antd/es/layout/layout'), {
  ssr: false,
})
const Content = dynamic(async () => await import('antd/es/layout/layout'), {
  ssr: false,
});

const MenuSider = dynamic(async () => await import('../../../../components/dashboard/MenuSider'), { ssr: false })
const Navbar = dynamic(async () => await import('../../../../components/dashboard/Navbar'), { ssr: false })

import { FaRing } from "react-icons/fa";
import { AiFillFilePdf } from "react-icons/ai";
export default function Reportes() {
  //open
  const [open1, setOpen1] = useState(false);
  const [open3, setOpen3] = useState(false);
  const [open4, setOpen4] = useState(false);
  //cargado de datos desde la API
  const [persona, setPersona] = useState<Persona>(dataPersona);
  //cargado de datos desde la API
  const [adultoMayor, setAdultoMayor] =
    useState<{ adulto: AdultoMayor2, hijos: Hijo[] }>({ hijos: [], adulto: dataDatosGenerales });
  const [adultos, setAdultos] = useState<AdultoMayor2[]>([]);
  const [displayAdultos, setDisplayAdultos] = useState<AdultoMayor2[]>([]);
  //RANGEPICKER
  //filtros
  const [filtros, setFiltros] = useState({ nombres_apellidos: "", ci: "", estado_civil: "" });
  useEffect(() => {
    let id_persona = localStorage.getItem('id_persona');
    let id_usuario = localStorage.getItem('id_usuario');
    if (id_persona && id_usuario) {
      axios.post<Persona>(process.env.BACKEND_URL + "/persona/get", { id_persona: id_persona }).then(res => {
        setPersona(res.data);
      });
      axios
        .get<AdultoMayor2[]>(process.env.BACKEND_URL + "/adulto/all")
        .then((res) => {
          setAdultos(res.data);
          setDisplayAdultos(res.data);
        });

    }
  }, []);


  return (
    <main>
      <Layout>
        <Layout hasSider>
          <MenuSider
            defaultOpenKeys={["adulto1"]}
            defaultSelectedKey="adulto1.3"
          ></MenuSider>
          <Content>
            <Navbar></Navbar>
            <Layout>
              <Content
                className="site-layout"
                style={{ padding: "0 50px", position: "relative" }}
              >
                <h1 className="text-center mt-4">REPORTES - ADULTOS</h1>
                <Row className="mt-5">
                  <Col span={24}>
                    <h3 className="text-center my-2 my-sm-4" style={{ fontSize: "1.75em" }}>Seleccione los filtros</h3>
                  </Col>
                  <Col span={20} offset={2} md={{ span: 10, offset: 2 }} lg={{ span: 8, offset: 3 }}>
                    <Button onClick={() => {
                      setOpen1(true)
                    }} className="filter-button g-1" icon={<MdDriveFileRenameOutline className="icon" />}>Por Nombres y Apellidos </Button>
                  </Col>

                  <Col span={20} offset={2} md={{ span: 10, offset: 2 }} lg={{ span: 8 }}>
                    <Button onClick={() => {
                      setOpen3(true)
                    }} className="filter-button g-3" icon={<HiIdentification className="icon" />}>Por C.I. </Button>
                  </Col>
                  <Col span={20} offset={2} md={{ span: 10, offset: 0 }} lg={{ span: 8, offset: 8 }}>
                    <Button onClick={() => {
                      setOpen4(true)
                    }} className="filter-button g-4" icon={<FaRing className="icon" />}> Por Estado Civil </Button>
                  </Col>
                </Row>
                <Row className="my-4">
                  <Col span={24}>
                    <h2 className="text-center mt-5 h4">Listado de adultos</h2>
                    <List
                      className="demo-loadmore-list"
                      itemLayout="horizontal"
                      pagination={{ defaultPageSize: 5, position: 'bottom', align: 'center' }}
                      dataSource={displayAdultos}
                      rowKey={(item) => {
                        return item.id_adulto + "l"
                      }}
                      renderItem={(item) => {
                        return (
                          <List.Item
                            actions={[
                              <Tooltip key={item.id_adulto + "tool"} title="Generar Reporte">
                                <Button style={{ width: 40, height: 40 }} icon={<AiFillFilePdf color="#A00" fontSize={25} />} onClick={() => {
                                  axios
                                    .post<
                                      { adulto: AdultoMayor2, hijos: Hijo[] }
                                    >(process.env.BACKEND_URL + "/adulto/get", {
                                      id_adulto: item.id_adulto,
                                    })
                                    .then((res) => {
                                      setAdultoMayor(res.data);
                                    });
                                  axios.post<Caso[]>(process.env.BACKEND_URL + "/caso/getByIdAdulto", { id_adulto: item.id_adulto }).then(res => {
                                    pdf(
                                      <ReporteAdulto hijos={adultoMayor.hijos} adulto={item} casos={res.data} persona={persona} />
                                    )
                                      .toBlob()
                                      .then((blob) => {
                                        notification.success({
                                          message: "¡Guardado y generado con éxito!",
                                        });
                                        const url = URL.createObjectURL(blob);
                                        const link = document.createElement("a");
                                        link.href = url;
                                        let { id_adulto } = item;
                                        link.setAttribute(
                                          "download",
                                          id_adulto +
                                          "-reporte.pdf"
                                        );
                                        document.body.appendChild(link);
                                        link.click();
                                        document.body.removeChild(link);
                                      }).catch((error: any) => {
                                        console.log(error)
                                      })

                                  })

                                }} className="center"></Button>
                              </Tooltip>
                            ]}
                          >
                            <List.Item.Meta
                              title={`${item.nombre} ${item.paterno} ${item.materno}`}
                              description={`C.I.: ${item.ci}, Fecha Nacimiento: ${item.f_nacimiento}`}
                            />
                          </List.Item>
                        )
                      }}
                    />
                  </Col>

                </Row>
              </Content>
            </Layout>
          </Content>
        </Layout>
      </Layout >
      <Modal okText="Filtrar" cancelText="Cancelar" title="Especifique el caso: N°/AÑO" open={open1} onOk={() => {
        setDisplayAdultos(adultos.filter(adulto => {
          return `${adulto.nombre} ${adulto.paterno} ${adulto.materno}`.toLowerCase().includes(filtros.nombres_apellidos.toLowerCase())
        }));
        setOpen1(false);
      }} onCancel={() => {
        setOpen1(false);
      }}>
        <Input
          placeholder="Nombres y apellidos del adulto mayor"
          value={filtros.nombres_apellidos}
          onChange={(ev) => {
            setFiltros({ ci: "", nombres_apellidos: ev.target.value, estado_civil: "" })
          }}
        />
      </Modal>
      <Modal okText="Filtrar" cancelText="Cancelar" title="Filtre mediante C.I." open={open3} onOk={() => {
        setOpen3(false);
      }} onCancel={() => {
        setOpen3(false)
      }}>
        <InputNumber
          style={{ width: "100%" }}
          minLength={7}
          min={0}
          value={Number.parseInt(filtros.ci)}
          placeholder="Introduzca el C.I. del adulto mayor"
          onChange={(value) =>
            setFiltros({ ci: value?.toString()!, nombres_apellidos: "", estado_civil: "" })}
        />
      </Modal>
      <Modal okText="Filtrar" cancelText="Cancelar" title="Filtre por estado civil" open={open4} onOk={() => {
        setOpen4(false);
        setDisplayAdultos(adultos.filter(value => {
          return value.estado_civil == filtros.estado_civil;
        }))
      }} onCancel={() => {
        setOpen4(false)
      }}>
        <Select
          onChange={(value) => {
            setFiltros({ ci: "", nombres_apellidos: "", estado_civil: value })
          }}
          style={{ width: "100%" }}
        >
          <Select.Option value="Soltero(a)">
            {"Soltero(a)"}
          </Select.Option>
          <Select.Option value="Viudo(a)">
            {"Viudo(a)"}
          </Select.Option>
          <Select.Option value="Concubino(a)">{"Concubino(a)"}</Select.Option>
        </Select>
      </Modal>
    </main>
  );
}
