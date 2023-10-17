
//estilos

const Formulario = dynamic(async () => await import("../../../../components/casos/nuevocaso/formulario"), { ssr: false })

import Detalles from "../../../../components/casos/nuevocaso/detalles";
import { useState } from "react";

import React from "react";
import {
  AdultoMayor,
  DatosDenuncia,
  DatosDenunciado,
  DatosUbicacion,
  dataDatosDenuncia,
  dataDatosDenunciado,
  dataDatosGenerales,
  dataDatosUbicacion,
} from "../../../../components/casos/nuevocaso/data";
const MenuSider = dynamic(async () => await import('../../../../components/dashboard/MenuSider'), { ssr: false })
const Navbar = dynamic(async () => await import('../../../../components/dashboard/Navbar'), { ssr: false })
const Layout = dynamic(async () => await import('antd/es/layout/layout'), { ssr: false });

import dynamic from "next/dynamic";
import { useRouter } from "next/router";

const Content = dynamic(async () => await import('antd/es/layout/layout'), {
  ssr: false,
});


export default function NuevoCaso() {
  const [datos, setDatos] = useState<{
    datosGenerales: AdultoMayor;
    datosUbicacion: DatosUbicacion;
    datosDenunciado: DatosDenunciado;
    descripcionHechos: string;
    descripcionPeticion: string;
    accionRealizada: string;
    datosDenuncia: DatosDenuncia;
  }>({
    datosGenerales: dataDatosGenerales,
    datosDenunciado: dataDatosDenunciado,
    datosUbicacion: dataDatosUbicacion,
    accionRealizada: "Apertura",
    descripcionHechos: "",
    descripcionPeticion: "",
    datosDenuncia: dataDatosDenuncia,
  });
  const [posicion, setPosicion] = useState(0);
  const getDatos = (data: {
    datosGenerales: AdultoMayor;
    datosUbicacion: DatosUbicacion;
    datosDenunciado: DatosDenunciado;
    descripcionHechos: string;
    descripcionPeticion: string;
    accionRealizada: string;
    datosDenuncia: DatosDenuncia;
  }) => {
    setDatos(data);
  };
  const getPosicion = (posicion: number) => {
    setPosicion(posicion);
  };
  const router = useRouter();

  return (
    <main>
      <Layout>
        <Layout hasSider>
          <MenuSider
            defaultOpenKeys={["caso1"]}
            defaultSelectedKey="caso1.1"
          ></MenuSider>
          <Content>
            <Navbar></Navbar>
            <Layout>
              <Content className="site-layout" style={{ padding: "0 20px" }}>
                <div className={posicion == 0 ? "mostrar" : "ocultar"}>
                  <Formulario
                    getPosicion={getPosicion}
                    getDatos={getDatos}
                  ></Formulario>
                </div>

                <div className={posicion == 1 ? "mostrar" : "ocultar"}>
                  <Detalles
                    getPosicion={getPosicion}
                    datos={datos}
                    router={router}
                  ></Detalles>
                </div>
              </Content>
            </Layout>
          </Content>
        </Layout>
      </Layout>
    </main>
  );
}
