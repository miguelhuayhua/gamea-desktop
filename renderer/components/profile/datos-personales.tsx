import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Space,
  message,
  notification,
} from "antd";
import { Content } from "antd/es/layout/layout";
import { Persona, dias, meses } from "../personal/data";
import dayjs from "dayjs";
import { NextPage } from "next";
import axios from "axios";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { useState } from "react";
import moment from "moment";
import { departamentos } from "../casos/nuevocaso/data";
import dynamic from "next/dynamic";
import { Usuario } from "../usuarios/data";
const Paragraph = dynamic(async () => await import("antd/es/typography/Paragraph"), {
  ssr: false,
}); interface Props {
  persona: Persona;
  setPersona: any;
  usuario: Usuario
}

const DatosPersonales: NextPage<Props> = (props) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Modal
        title="CONFIRMAR"
        okText="Sí"
        cancelText="No"
        open={open}
        onOk={() => {
          console.log({ ...props.persona })
          axios
            .post(process.env.BACKEND_URL + "/persona/update", {
              ...props.persona,
              usuario: props.usuario
            })
            .then((res) => {
              if (res.data.status == 1) {
                notification.success({
                  message:
                    "Datos personales modificados con éxito...",
                  duration: 10,

                });
                setOpen(false);
              } else {
                notification.error({
                  message: "Error en el servidor...",
                });
              }
            });
        }}
        onCancel={() => {
          setOpen(false);
        }}
      >
        <div className="column-centered">
          <QuestionCircleOutlined
            style={{ fontSize: "4em", color: "#555", marginBottom: ".5em" }}
          />
          <p className="h5 text-center">
            ¿Está seguro en realizar los cambios?
          </p>
        </div>
      </Modal>
      <Content className="mt-2">
        <Row gutter={[24, 24]}>
          <Col span={24} lg={{ span: 12 }}>
            <Form
              onFinish={() => {
                setOpen(true);
              }}
            >
              <Row gutter={[24, 24]}>
                <Col span={24}>
                  <Form.Item label="Profesión:">
                    <Input
                      required
                      name="profesion"
                      value={props.persona.profesion}
                      onChange={(ev) => {
                        props.setPersona({
                          ...props.persona,
                          profesion: ev.target.value,
                        });
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col span={24} >
                  <Form.Item label="Celular:">
                    <InputNumber
                      style={{ width: "100%" }}
                      name="celular"
                      required
                      onChange={(ev) => {
                        props.setPersona({
                          ...props.persona,
                          celular: ev,
                        });
                      }}
                      value={props.persona.celular}
                    />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Space.Compact>
                    <Form.Item label="C.I. / Expedido:">
                      <InputNumber
                        required
                        name="ci"
                        value={props.persona.ci}
                        style={{ width: "100%" }}
                        onChange={(ev) => {
                          props.setPersona({
                            ...props.persona,
                            ci: ev,
                          });
                        }}
                      />
                    </Form.Item>
                    <Form.Item>
                      <Select
                        aria-required
                        value={props.persona.expedido}
                        style={{ width: 180 }}
                        defaultValue="LP"
                        options={departamentos}
                        onChange={(value) => {
                          props.setPersona({
                            ...props.persona,
                            expedido: value,
                          });
                        }}
                      />
                    </Form.Item>
                  </Space.Compact>
                </Col>

                <Col span={24} >
                  <Form.Item label="Fecha de Nacimiento">
                    <DatePicker
                      style={{ width: "100%" }}
                      aria-required
                      onChange={(value) => {
                        props.setPersona({
                          ...props.persona,
                          f_nacimiento: value?.format("YYYY-MM-DD"),
                        });
                      }}
                      locale={
                        {

                          "lang": {
                            "placeholder": "Seleccionar fecha",
                            "rangePlaceholder": [
                              "Fecha inicial",
                              "Fecha final"
                            ],
                            shortMonths: meses,
                            shortWeekDays: dias,
                            "locale": "es_ES",
                            "today": "Hoy",
                            "now": "Ahora",
                            "backToToday": "Volver a hoy",
                            "ok": "Aceptar",
                            "clear": "Limpiar",
                            "month": "Mes",
                            "year": "Año",
                            "timeSelect": "Seleccionar hora",
                            "dateSelect": "Seleccionar fecha",
                            "monthSelect": "Elegir un mes",
                            "yearSelect": "Elegir un año",
                            "decadeSelect": "Elegir una década",
                            "yearFormat": "YYYY",
                            "dateFormat": "D/M/YYYY",
                            "dayFormat": "D",
                            "dateTimeFormat": "D/M/YYYY HH:mm:ss",
                            "monthBeforeYear": true,
                            "previousMonth": "Mes anterior (PageUp)",
                            "nextMonth": "Mes siguiente (PageDown)",
                            "previousYear": "Año anterior (Control + left)",
                            "nextYear": "Año siguiente (Control + right)",
                            "previousDecade": "Década anterior",
                            "nextDecade": "Década siguiente",
                            "previousCentury": "Siglo anterior",
                            "nextCentury": "Siglo siguiente",
                          },
                          "timePickerLocale": {
                            "placeholder": "Seleccionar hora"
                          }
                        }
                      }
                      value={dayjs(props.persona.f_nacimiento)}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Button
                style={{ display: "block", margin: "0 auto", border:"1px solid gray" }}
                key="ok"
                htmlType="submit"
              >
                Aceptar y Modificar
              </Button>
            </Form>
          </Col>
          <Col span={24} lg={12}>
            <Card title="DATOS PERSONALES">
              <b style={{ fontWeight: "bold" }}>ID PERSONA: </b>
              <Paragraph className="center" copyable={{ tooltips: "Copiar", onCopy: () => message.success({ content: "Copiado exitosamente" }) }}>
                {props.persona.id_persona}
              </Paragraph>
              <p>
                <b style={{ fontWeight: "bold" }}>Nombres y Apellidos: </b>
                {`${props.persona.nombres} ${props.persona.paterno} ${props.persona.materno}`}
              </p>
              <p>
                <b style={{ fontWeight: "bold" }}>C.I.: </b>
                {props.persona.ci}

              </p>
              <p>
                <b style={{ fontWeight: "bold" }}>Expedido: </b>
                {props.persona.expedido}
              </p>
              <p>
                <b style={{ fontWeight: "bold" }}>Fecha de nacimiento: </b>
                {dayjs(props.persona.f_nacimiento).format('DD-MM-YYYY')}
              </p>
              <p>
                <b style={{ fontWeight: "bold" }}> Edad: </b>
                {-dayjs(props.persona.f_nacimiento).diff(moment.now(), "years")}
              </p>
            </Card>
          </Col>
        </Row>
      </Content>
    </>
  );
};

export default DatosPersonales;
