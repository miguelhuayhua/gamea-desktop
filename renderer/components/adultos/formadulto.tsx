;
import {
  Avatar,
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  List,
  Radio,
  Row,
  Select,
  Tooltip,
  message,
} from "antd";
import { NextPage } from "next";

import { UserOutlined, CopyOutlined } from "@ant-design/icons";
import moment from "moment";
import { Adulto } from "./data";
import dayjs from "dayjs";
import { dias, meses } from "../casos/nuevocaso/data";
import dynamic from "next/dynamic";
const Paragraph = dynamic(async () => await import("antd/es/typography/Paragraph"), {
  ssr: false,
});
interface Props {
  adulto: Adulto;
  setAdulto: any;
}
const FormAdulto: NextPage<Props> = (props) => {
  const handleFNacimiento = (value: any) => {
    if (value) {
      let edad = -Number.parseInt(value.diff(moment.now(), "years"));
      props.setAdulto({
        ...props.adulto,
        f_nacimiento: dayjs(value.$d),
        edad,
      });
    }
  };
  return (
    <>
      <Col span={24}>
        <Form layout="horizontal">
          <Row gutter={[12, 12]}>
            <Col span={24}>
              <Avatar
                style={{
                  backgroundColor:
                    props.adulto.genero == "Femenino" ? "#ff0080" : "#0041c8",
                  color: "white",
                  width: 40,
                  height: 40,
                  fontSize: 20,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto",
                }}
                icon={<UserOutlined />}
              ></Avatar>
              <Paragraph copyable={{ tooltips: "Copiar", onCopy: () => message.success({ content: "Copiado exitosamente" }) }}  >{props.adulto.id_adulto}</Paragraph>

            </Col>
            <Col span={24}>
              <Form.Item label="Nombres: ">
                <Input
                  name="nombre"
                  value={props.adulto.nombre}
                  onChange={(value) =>
                    props.setAdulto({
                      ...props.adulto,
                      nombre: value.target.value,
                    })
                  }
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="Apellido paterno: ">
                <Input
                  name="paterno"
                  value={props.adulto.paterno}
                  onChange={(value) =>
                    props.setAdulto({
                      ...props.adulto,
                      paterno: value.target.value,
                    })
                  }
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="Apellido materno: ">
                <Input
                  name="materno"
                  value={props.adulto.materno}
                  onChange={(value) =>
                    props.setAdulto({
                      ...props.adulto,
                      materno: value.target.value,
                    })
                  }
                />
              </Form.Item>
            </Col>
            <Col span={24} >
              <Form.Item label={"Fecha de Nacimiento:"}>
                <DatePicker
                  value={dayjs(props.adulto.f_nacimiento)}
                  placeholder="Ingrese su fecha de Nacimiento"
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
                  onChange={handleFNacimiento}
                  className="w-100"
                ></DatePicker>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Edad"
                rules={[
                  {
                    min: 60,
                    message: "No puede tener una edad menor a 60...",
                  },
                ]}
              >
                <InputNumber className="w-100" value={props.adulto.edad} min={60} />
              </Form.Item>
            </Col>
            <Col span={12} >
              <Form.Item
                label="N° de C.I."
                rules={[
                  {
                    required: true,
                    message: "Inserte el carnet de identidad",
                  },
                ]}
              >
                <InputNumber
                  style={{ width: "90%" }}
                  minLength={7}
                  min={0}
                  className="w-100"
                  value={props.adulto.ci}
                  onChange={(value) =>
                    props.setAdulto({ ...props.adulto, ci: value })
                  }
                />
              </Form.Item>
            </Col>
            <Col span={24} >
              <Form.Item label="genero:">
                <Radio.Group
                  value={props.adulto.genero}
                  defaultValue={props.adulto.genero}
                  onChange={(value) =>
                    props.setAdulto({
                      ...props.adulto,
                      genero: value.target.value,
                    })
                  }
                >
                  <Radio value="Femenino"> Femenino </Radio>
                  <Radio value="Masculino"> Masculino </Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Estado Civil:">
                <Select
                  value={props.adulto.estado_civil}
                  defaultValue={props.adulto.estado_civil}
                  onChange={(value) =>
                    props.setAdulto({
                      ...props.adulto,
                      estado_civil: value,
                    })
                  }
                >
                  <Select.Option value="Soltero(a)">Soltero(a)</Select.Option>
                  <Select.Option value="Casado(a)">Casado(a)</Select.Option>
                  <Select.Option value="Concubino(a)">
                    Concubino(a)
                  </Select.Option>
                  <Select.Option value="Divorciado(a)">
                    Divorciado(a)
                  </Select.Option>
                  <Select.Option value="Viudo(a)">Viudo(a)</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12} >
              <Form.Item
                label="N° de Referencia:"
                rules={[
                  {
                    required: true,
                    message: "Inserte un número de referencia",
                  },
                ]}
              >
                <InputNumber
                  onChange={(value) =>
                    props.setAdulto({
                      ...props.adulto,
                      nro_referencia: value,
                    })
                  }
                  minLength={8}
                  value={props.adulto.nro_referencia}
                  style={{ width: "90%" }}
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label="Ocupación:"
                rules={[
                  {
                    required: true,
                    message: "Inserte la ocupacion...",
                  },
                ]}
              >
                <Input
                  value={props.adulto.ocupacion}
                  onChange={(value) =>
                    props.setAdulto({
                      ...props.adulto,
                      ocupacion: value.target.value,
                    })
                  }
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="Grado de Instrucción:">
                <Select
                  onChange={(value) =>
                    props.setAdulto({ ...props.adulto, grado: value })
                  }
                  value={props.adulto.grado}
                  defaultValue={props.adulto.grado}
                >
                  <Select.Option value="Primaria">Primaria</Select.Option>
                  <Select.Option value="Secundaria">Secundaria</Select.Option>
                  <Select.Option value="Tecnico">Técnico</Select.Option>
                  <Select.Option value="Universitario">
                    Universitario
                  </Select.Option>
                  <Select.Option value="S/Inst.">Sin Instrucción</Select.Option>
                </Select>
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item label="Beneficios:">
                <Select
                  onChange={(value) =>
                    props.setAdulto({
                      ...props.adulto,
                      beneficios: value,
                    })
                  }
                  defaultValue={props.adulto.beneficios}
                  value={props.adulto.beneficios}
                >
                  <Select.Option value="Renta Dignidad">
                    Renta Dignidad
                  </Select.Option>
                  <Select.Option value="Jubilado">Jubilado</Select.Option>
                  <Select.Option value="Ninguno">Ninguno</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Col>
      <Col
        span={24}
        style={{
          border: "1px solid #CCC",
          padding: 10,
          borderRadius: 10,
          margin: "15px 0",
        }}
      >
        <Row>
          <Col span={24}>
            {props.adulto.hijos.length == 0 ? (
              <>
                <h6>HIJOS DEL ADULTO MAYOR</h6>
                <h6 style={{ color: "red" }}>La persona no tiene hijos...</h6>
              </>
            ) : (
              <>
                <h6>HIJOS DEL ADULTO MAYOR</h6>
                <hr />
                <List
                  itemLayout="horizontal"
                  dataSource={props.adulto.hijos}
                  renderItem={(item, index) => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={
                          <Avatar
                            style={{
                              backgroundColor:
                                item.genero == "Femenino"
                                  ? "#ff0080"
                                  : "#0041c8",
                              color: "white",
                            }}
                            icon={<UserOutlined />}
                          ></Avatar>
                        }
                        title=<b>{item.nombres_apellidos}</b>
                      />
                      <div>
                        <Tooltip
                          title={
                            <>
                              Copiar ID:
                              <b style={{ marginLeft: 5 }}>
                                {" " + item.id_hijo}
                              </b>
                            </>
                          }
                        >
                          <Button
                            onClick={() => {
                              const textField =
                                document.createElement("textarea");
                              textField.innerText = item.id_hijo;
                              document.body.appendChild(textField);
                              textField.select();
                              navigator.clipboard
                                .writeText(item.id_hijo)
                                .then(() => {
                                  textField.remove();
                                  message.success(
                                    "¡ID - Hijo, copiado al portapapeles!"
                                  );
                                });
                            }}
                            icon={<CopyOutlined color="blue" />}
                          ></Button>
                        </Tooltip>
                      </div>
                    </List.Item>
                  )}
                />
              </>
            )}
          </Col>
        </Row>
      </Col>
    </>
  );
};

export default FormAdulto;
