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
  notification,
} from "antd";
import { Content } from "antd/es/layout/layout";
import { Persona} from "../personal/data";
import dayjs from "dayjs";
import { NextPage } from "next";
import axios from "axios";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { useState } from "react";
import moment from "moment";
import { departamentos } from "../casos/nuevocaso/data";
import dynamic from "next/dynamic";
const Paragraph = dynamic(async () => await import("antd/es/typography/Paragraph"), {
  ssr: false,
});  interface Props {
  persona: Persona;
  setPersona: any;
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
          axios
            .post(process.env.BACKEND_URL + "/persona/update", {
              ...props.persona,
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
          <Col span={24} lg={{ span: 16 }}>
            <Form
              onFinish={() => {
                setOpen(true);
              }}
            >
              <Row gutter={[24, 24]}>
                <Col span={24} md={{ span: 11, offset: 1 }}>
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
                <Col span={24} md={{ span: 10 }}>
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
                <Col span={24} md={{ span: 11, offset: 1 }}>
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
                        style={{ width: 120 }}
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

                <Col span={24} md={{ span: 9 }}>
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
                      locale={{

                        lang: {
                          locale: "es_ES", // Cambia "es_ES" al código de idioma que prefieras
                          month: "Mes",
                          year: "Año",
                          ok: "Aceptar",
                          previousMonth: "Mes anterior",
                          dayFormat: "D",
                          previousYear: "Año anterior",
                          nextYear: "Año siguiente",
                          previousDecade: "Década anterior",
                          nextDecade: "Década siguiente",
                          previousCentury: "Siglo anterior",
                          nextCentury: "Siglo siguiente",
                          shortWeekDays: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"],
                          shortMonths: [
                            "Ene",
                            "Feb",
                            "Mar",
                            "Abr",
                            "May",
                            "Jun",
                            "Jul",
                            "Ago",
                            "Sep",
                            "Oct",
                            "Nov",
                            "Dic",
                          ],
                          dateFormat: "YYYY-MM-DD",
                          dateTimeFormat: "YYYY-MM-DD HH:mm:ss",
                          monthFormat: "MMMM YYYY",
                          today: "Hoy",
                          now: "Ahora",
                          backToToday: "Volver",
                          clear: "Limpiar",
                          dateSelect: "Seleccionar fecha",
                          timeSelect: "Seleccionar hora",
                          placeholder: "Seleccionar fecha y hora", // Agregado el placeholder,
                          nextMonth: "Mes siguiente",
                          decadeSelect: "Seleccionar década",
                          monthSelect: "Seleccionar mes",
                          yearFormat: "YYYY",
                          yearSelect: "Seleccione año"
                        },
                        timePickerLocale: {
                          placeholder: "Seleccionar hora",
                          rangePlaceholder: ["Hora de inicio", "Hora de fin"],
                        },
                        // Otras propiedades del objeto locale


                      }}
                      value={dayjs(props.persona.f_nacimiento)}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Button
                style={{ display: "block", margin: "0 auto" }}
                key="ok"
                htmlType="submit"
                type="primary"
              >
                Aceptar y Modificar
              </Button>
            </Form>
          </Col>
          <Col span={24} lg={8}>
            <Card title="DATOS PERSONALES">
              <b style={{ fontWeight: "bold" }}>ID PERSONA: </b>
              <Paragraph copyable style={{ display: 'flex', alignItems: 'center' }}>
                {props.persona.id_persona}
              </Paragraph>
              <p>
                <b style={{ fontWeight: "bold" }}>Nombres y Apellidos: </b>
                {`${props.persona.nombres} ${props.persona.paterno} ${props.persona.materno}`}
              </p>
              <p>
                <b style={{ fontWeight: "bold" }}>C.I.: </b>
                {props.persona.ci}
                <b style={{ fontWeight: "bold", marginLeft: 20 }}>Expedido: </b>
                {props.persona.expedido}
              </p>
              <p>
                <b style={{ fontWeight: "bold" }}>Fecha de nacimiento: </b>
                {dayjs(props.persona.f_nacimiento).format('DD-MM-YYYY')}
                <b style={{ fontWeight: "bold", marginLeft: 20 }}> Edad: </b>
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
