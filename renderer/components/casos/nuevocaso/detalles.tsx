;
interface Props {
  getPosicion: any;
  datos: {
    datosGenerales: AdultoMayor;
    datosUbicacion: DatosUbicacion;
    descripcionHechos: string;
    descripcionPeticion: string;
    datosDenunciado: DatosDenunciado;
    accionRealizada: string;
    datosDenuncia: DatosDenuncia;
  };
  router: any;
}
import {
  Affix,
  Badge,
  Button,
  Col,
  Divider,
  Dropdown,
  FloatButton,
  Modal,
  Progress,
  Row,
  Spin,
  notification,
} from "antd";
import { NextPage } from "next";
import {
  AdultoMayor,
  DatosDenuncia,
  DatosDenunciado,
  DatosUbicacion,
} from "./data";
import { createContext, useState } from "react";
import axios from "axios";
import MyDocument from "./pdf";
import { pdf } from "@react-pdf/renderer";
import { InfoCircleFilled } from "@ant-design/icons";
import dayjs from "dayjs";
import { Persona } from "@/components/personal/data";
import { Usuario } from "@/components/usuarios/data";
export const DataContext = createContext({});
//

//PDF

const Detalles: NextPage<Props> = (props) => {
  if (typeof window !== "undefined") {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  //estados
  const [open, setOpen] = useState(false);
  const [counter, setCounter] = useState(0);
  const [estado, setEstado] = useState(false);
  const [success, setSuccess] = useState(false);
  const handleVolver = () => {
    props.getPosicion(0);
    notification.info({ message: "Verifique nuevamente los datos..." });
  };

  //referencias
  const handleEnviar = async () => {
    setOpen(true);
    let interval = setInterval(
      () => {
        if (counter <= 90) {
          setCounter((prev) => prev + 10);
        }
      },
      250,
      ["counter"]
    );

    let id_persona = localStorage.getItem('id_persona');
    let id_usuario = localStorage.getItem('id_usuario');
    if (id_persona && id_usuario) {
      axios.post<Usuario>(process.env.BACKEND_URL + "/usuario/get", { id_usuario: id_usuario }).then(res2 => {
        axios.post<Persona>(process.env.BACKEND_URL + "/persona/get", { id_persona: id_persona }).then(res => {

          pdf(
            <DataContext.Provider value={{ ...props.datos, persona: res.data }}>
              <MyDocument />
            </DataContext.Provider>
          )
            .toBlob()
            .then((blob) => {
              const url = URL.createObjectURL(blob);
              const link = document.createElement("a");
              link.href = url;
              let { nombre, paterno, materno } = props.datos.datosGenerales;

              link.setAttribute(
                "download",
                nombre +
                paterno +
                materno +
                "caso.pdf"
              );
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            });
          axios
            .post(process.env.BACKEND_URL + "/denuncia/insert", { ...props.datos, usuario: res2.data })
            .then((res) => {
              setSuccess(true);
              setCounter(100);
              setEstado(false);
              if (res.data.status == 1) {
                notification.success({ message: res.data.response });
                props.router.push("/dashboard/casos");
              } else {
                notification.error({ message: res.data.response });
              }
            })
            .catch((err) => {
              clearInterval(interval);
              setEstado(true);
              setSuccess(false);
            });
        });
      });

    }

  };
  const cancel = () => {
    setOpen(false);
    notification.info({ message: "Modifique si desea..." });
  };

  return (
    <>
      <Row className="my-4">
        <Col span={24} md={{ span: 22, offset: 1 }}>
          <Affix offsetTop={100}>
            <Dropdown
              trigger={["click"]}
              menu={{
                items: [
                  {
                    key: "1",
                    label: (
                      <div style={{ width: 300 }}>
                        <h6 style={{ textAlign: "center" }}>
                          Detalles del caso nro:
                          <b>
                            {" " +
                              props.datos.datosDenuncia.nro_caso +
                              "/" +
                              dayjs().year()}
                          </b>
                        </h6>

                        <hr />
                        <Row>
                          <Col span={24}>
                            <p className="info">
                              <span>
                                <b>Fecha de Registro del caso: </b>
                              </span>
                              {props.datos.datosDenuncia.fecha_registro}
                            </p>
                          </Col>
                          <Col span={24}>
                            <p className="info">
                              <b>Hora de registro del caso: </b>
                              {props.datos.datosDenuncia.hora_registro}
                            </p>
                          </Col>
                          <Col span={24}>
                            <p className="info">
                              <b>Tipología: </b>
                              {props.datos.datosDenuncia.tipologia}
                            </p>
                          </Col>
                          <Col span={24}>
                            <p className="info">
                              <b>Acción realizada: </b>
                              {props.datos.accionRealizada}
                            </p>
                          </Col>
                        </Row>
                      </div>
                    ),
                  },
                ],
              }}
              placement="bottomRight"
              arrow={{ pointAtCenter: true }}
            >
              <Button
                style={{
                  border: "none",
                  width: 60,
                  height: 60,
                  position: "absolute",
                  right: 0,
                  top: 0,
                  zIndex: 10,
                }}
              >
                <InfoCircleFilled style={{ fontSize: "2em" }} />
              </Button>
            </Dropdown>
          </Affix>
          <Row className="mt-4 rounded overflow-hidden">
            <Col span={24} lg={{ span: 20, offset: 2 }}>
              <Divider className="fw-light" style={{ fontSize: 20 }} orientation="left">
                Datos generales
              </Divider>
            </Col>
            <Col span={24} lg={{ span: 20, offset: 2 }}>
              <Badge status="processing" text="Datos Validados" />
            </Col>
            <Col span={24} lg={{ span: 20, offset: 2 }}>
              <div className="d-flex w-100">
                <p className="titulo">Nombres: </p>
                <p className="contenido">{props.datos.datosGenerales.nombre}</p>
              </div>
            </Col>
            <Col span={24} lg={{ span: 20, offset: 2 }}>
              <div className="d-flex w-100">
                <p className="titulo">Apellido Paterno: </p>
                <p className="contenido">
                  {props.datos.datosGenerales.paterno}
                </p>
              </div>
            </Col>
            <Col span={20} offset={2}>
              <div className="d-flex w-100">
                <p className="titulo">Apellido Materno: </p>
                <p className="contenido">
                  {props.datos.datosGenerales.materno}
                </p>
              </div>
            </Col>
            <Col span={24} lg={{ span: 10, offset: 2 }}>
              <div className="d-flex w-100">
                <p className="titulo">Fecha de nacimiento: </p>
                <p className="contenido">
                  {props.datos.datosGenerales.f_nacimiento}
                </p>
              </div>
            </Col>
            <Col span={24} lg={{ span: 10 }}>
              <div className="d-flex w-100">
                <p className="titulo">Edad: </p>
                <p className="contenido">{props.datos.datosGenerales.edad}</p>
              </div>
            </Col>

            <Col span={24} lg={{ span: 10, offset: 2 }}>
              <div className="d-flex w-100">
                <p className="titulo">C.I.: </p>
                <p className="contenido"> {props.datos.datosGenerales.ci}</p>
              </div>
            </Col>
            <Col span={24} lg={{ span: 10 }}>
              <div className="d-flex w-100">
                <p className="titulo">Estado Civil: </p>
                <p className="contenido">
                  {props.datos.datosGenerales.estado_civil}
                </p>
              </div>
            </Col>
            <Col span={24} lg={{ span: 10, offset: 2 }}>
              <div className="d-flex w-100">
                <p className="titulo">Género: </p>
                <p className="contenido">
                  {" "}
                  {props.datos.datosGenerales.genero}
                </p>
              </div>
            </Col>
            <Col span={24} lg={{ span: 10 }}>
              <div className="d-flex w-100">
                <p className="titulo"> Beneficios: </p>
                <p className="contenido">
                  {props.datos.datosGenerales.beneficios}
                </p>
              </div>
            </Col>
            <Col span={24} lg={{ span: 10, offset: 2 }}>
              <div className="d-flex w-100">
                <p className="titulo">Nivel de Estudios: </p>
                <p className="contenido"> {props.datos.datosGenerales.grado}</p>
              </div>
            </Col>
            <Col span={24} lg={{ span: 10 }}>
              <div className="d-flex w-100">
                <p className="titulo"> Nro. de referencia: </p>
                <p className="contenido">
                  {props.datos.datosGenerales.nro_referencia}
                </p>
              </div>
            </Col>
            <Col span={24} lg={{ span: 10, offset: 2 }}>
              <div className="d-flex w-100">
                <p className="titulo">Ocupación: </p>
                <p className="contenido">
                  {props.datos.datosGenerales.ocupacion}
                </p>
              </div>
            </Col>
            <Col span={24} lg={{ span: 10 }}>
              <div className="d-flex w-100">
                <p className="titulo"> Hijos: </p>
                <p className="contenido">
                  {props.datos.datosGenerales.hijos.map((value, _i) => {
                    return (
                      <div key={_i}>
                        {value} <br></br>
                      </div>
                    );
                  })}
                </p>
              </div>
            </Col>
          </Row>
        </Col>

        <Col
          style={{ marginTop: "2em" }}
          span={24}
          md={{ span: 22, offset: 1 }}
        >
          <Row className="rounded overflow-hidden">
            <Col span={20} offset={2}>
              <Divider className="fw-light" style={{ fontSize: 20 }} orientation="left">
                Datos de ubicación
              </Divider>
            </Col>
            <Col span={20} offset={2}>
              <Badge status="processing" text="Datos Validados" />
            </Col>
            <Col span={24} lg={{ span: 10, offset: 2 }}>
              <div className="d-flex w-100">
                <p className="titulo">Distrito: </p>
                <p className="contenido">
                  {props.datos.datosUbicacion.distrito}
                </p>
              </div>
            </Col>
            <Col span={24} lg={{ span: 10 }}>
              <div className="d-flex w-100">
                <p className="titulo">Área: </p>
                <p className="contenido">
                  {props.datos.datosUbicacion.area == "Otro"
                    ? props.datos.datosUbicacion.area +
                    " (" +
                    props.datos.datosUbicacion.otra_area +
                    ")"
                    : props.datos.datosUbicacion.area}
                </p>
              </div>
            </Col>
            <Col span={24} lg={{ span: 10, offset: 2 }}>
              <div className="d-flex w-100">
                <p className="titulo">Calle o avenida: </p>
                <p className="contenido">
                  {props.datos.datosUbicacion.calle_av}
                </p>
              </div>
            </Col>
            <Col span={24} lg={{ span: 10 }}>
              <div className="d-flex w-100">
                <p className="titulo">Tipo de domicilio: </p>
                <p className="contenido">
                  {props.datos.datosUbicacion.tipo_domicilio}
                </p>
              </div>
            </Col>

            <Col span={24} lg={{ span: 10, offset: 2 }}>
              <div className="d-flex w-100">
                <p className="titulo">N° de vivienda: </p>
                <p className="contenido">
                  {props.datos.datosUbicacion.nro_vivienda}
                </p>
              </div>
            </Col>
            <Col span={24} lg={{ span: 10 }}>
              <div className="d-flex w-100">
                <p className="titulo">Zona: </p>
                <p className="contenido">{props.datos.datosUbicacion.zona}</p>
              </div>
            </Col>
          </Row>
        </Col>
        <Col
          style={{ marginTop: "2em" }}
          span={24}
          md={{ span: 22, offset: 1 }}
        >
          <Row className="rounded overflow-hidden">
            <Col span={20} offset={2}>
              <Divider className="fw-light" style={{ fontSize: 20 }} orientation="left">
                Datos del denunciado
              </Divider>
            </Col>
            <Col span={20} offset={2}>
              <Badge status="processing" text="Datos Validados" />
            </Col>
            <Col span={24} lg={{ span: 20, offset: 2 }}>
              <div className="d-flex w-100">
                <p className="titulo">Nombre del denunciado: </p>
                <p className="contenido">
                  {props.datos.datosDenunciado.nombres}
                </p>
              </div>
            </Col>
            <Col span={24} lg={{ span: 20, offset: 2 }}>

              <div className="d-flex w-100">
                <p className="titulo">Apellido paterno: </p>
                <p className="contenido">
                  {props.datos.datosDenunciado.paterno}
                </p>
              </div>
            </Col>
            <Col span={24} lg={{ span: 20, offset: 2 }}>
              <div className="d-flex w-100">
                <p className="titulo">Apellido materno: </p>
                <p className="contenido">
                  {props.datos.datosDenunciado.materno}
                </p>
              </div>
            </Col>
            <Col span={24} lg={{ span: 20, offset: 2 }}>
              <div className="d-flex w-100">
                <p className="titulo">Parentezco: </p>
                <p className="contenido">
                  {props.datos.datosDenunciado.parentezco}
                </p>
              </div>
            </Col>
          </Row>
        </Col>
        <Col
          style={{ marginTop: "2em" }}
          span={24}
          md={{ span: 22, offset: 1 }}
        >
          <Row className="rounded overflow-hidden">

            <Col span={20} offset={2}>
              <Divider className="fw-light" style={{ fontSize: 20 }} orientation="left">
                Descripciones
              </Divider>
            </Col>
            <Col span={20} offset={2}>
              <Badge status="processing" text="Datos Validados" />
            </Col>
            <Col span={24} lg={{ span: 20, offset: 2 }}>
              <div className="d-flex w-100">
                <p className="titulo" style={{ width: "20%" }}>
                  Descripción de los hechos:
                </p>
                <p className="contenido" style={{ width: "80%" }}>
                  {props.datos.descripcionHechos.length == 0
                    ? "No existe descripción"
                    : props.datos.descripcionHechos}
                </p>
              </div>
            </Col>
            <Col span={24} lg={{ span: 20, offset: 2 }}>
              <div className="d-flex w-100">
                <p className="titulo" style={{ width: "20%" }}>
                  Descripción de petición:
                </p>
                <p className="contenido" style={{ width: "80%" }}>
                  {props.datos.descripcionPeticion.length == 0
                    ? "No existe descripción"
                    : props.datos.descripcionPeticion}
                </p>
              </div>
            </Col>
          </Row>
        </Col>

        <Col sm={{ span: 12, offset: 0 }} md={{ offset: 4, span: 8 }}>
          <Button
            onClick={handleVolver}
            className="my-3"
            style={{ width: "90%", margin: "auto 0" }}
          >
            Volver
          </Button>
        </Col>
        <Col
          sm={{ span: 12, offset: 0 }}
          md={{ span: 8 }}
          style={{ width: "90%", margin: "auto 0" }}
        >
          <Button type="primary" onClick={handleEnviar} className="w-100 my-3">
            Enviar y Generar Formulario
          </Button>
        </Col>
      </Row>
      <Modal
        onCancel={cancel}
        footer={null}
        style={{ textAlign: "center" }}
        title={
          success ? (
            <div>
              <p>Envíado con éxito, generando Formulario...</p>
              <Spin></Spin>
            </div>
          ) : (
            <p>En progreso</p>
          )
        }
        open={open}
      >
        <div className={!estado ? "hidden" : ""}>
          <Progress
            type="circle"
            percent={counter}
            size={80}
            status={estado ? "exception" : "normal"}
          />
        </div>
      </Modal>
      <FloatButton.BackTop />
    </>
  );
};
export default Detalles;
