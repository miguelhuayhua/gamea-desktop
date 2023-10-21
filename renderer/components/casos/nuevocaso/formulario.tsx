;
import {
  AutoComplete,
  Button,
  Col,
  DatePicker,
  Divider,
  FloatButton,
  Form,
  Input,
  InputNumber,
  InputRef,
  Modal,
  Radio,
  Row,
  Select,
  Tag,
  TimePicker,
  message,
  notification,
} from "antd";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import {
  AdultoMayor,
  DatosDenuncia,
  DatosDenunciado,
  DatosUbicacion,
  dataDatosDenuncia,
  dataDatosDenunciado,
  dataDatosGenerales,
  dataDatosUbicacion,
  departamentos,
  dias,
  meses,
} from "./data";
import dayjs from "dayjs";
import dynamic from "next/dynamic";
const TextArea = dynamic(async () => await import("antd/es/input/TextArea"), {
  ssr: false,
})
import { PlusOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import moment, { now } from "moment";
import FormItem from "antd/es/form/FormItem";
import { NextPage } from "next";
import axios from "axios";
import { capitalize, locale } from "@/components/data";

interface Props {
  getDatos: any;
  getPosicion: any;
}
const Formulario: NextPage<Props> = (props) => {
  //cargado de datos
  const [nombres, setNombres] = useState<{
    nombres: { value: string }[];
    apellidos: { value: string }[];
  }>({ nombres: [], apellidos: [] });
  //manejo de confirmacion
  const [open, setOpen] = useState(false);
  const handleOpenChange = () => {
    setOpen(true);
  };
  const confirm = () => {
    setOpen(false);
    notification.success({
      message: "Si no existe una observación alguna, puede guardarlo.",
    });

    let adulto = datosGenerales;
    let denunciado = datosDenunciado;
    adulto.nombre = capitalize(adulto.nombre);
    adulto.paterno = capitalize(adulto.paterno);
    let hijos = adulto.hijos.map(hijo => {
      let convertido = "";
      hijo.split(' ').forEach(value => {
        convertido = convertido + " " + capitalize(value);
      });
      return convertido.trim();
    });
    adulto.materno = capitalize(adulto.materno);
    adulto.hijos = hijos;
    adulto.ocupacion = capitalize(adulto.ocupacion);
    denunciado.nombres = capitalize(denunciado.nombres);
    denunciado.paterno = capitalize(denunciado.paterno);
    denunciado.materno = capitalize(denunciado.materno);
    props.getDatos({
      datosGenerales: adulto,
      datosUbicacion,
      datosDenunciado: denunciado,
      descripcionHechos: descripcionHechos[0].toUpperCase() + descripcionHechos.substring(1, descripcionHechos.length),
      descripcionPeticion: descripcionPeticion[0].toUpperCase() + descripcionPeticion.substring(1, descripcionPeticion.length),
      accionRealizada,
      datosDenuncia,
    });
    props.getPosicion(1);
  };
  const cancel = () => {
    setOpen(false);
    notification.info({ message: "Modifique si desea..." });
  };
  //datos de formulario
  const [datosGenerales, setDatosGenerales] =
    useState<AdultoMayor>(dataDatosGenerales);
  const [datosUbicacion, setDatosUbicacion] =
    useState<DatosUbicacion>(dataDatosUbicacion);
  const [datosDenuncia, setDatosDenuncia] =
    useState<DatosDenuncia>(dataDatosDenuncia);
  const [descripcionHechos, setDescripcionHechos] = useState("");
  const [descripcionPeticion, setPeticion] = useState("");
  const [datosDenunciado, setDatosDenunciado] =
    useState<DatosDenunciado>(dataDatosDenunciado);
  const [accionRealizada, setAccionRealizada] = useState("Apertura");
  //DATOS EXTRAS Y REFERENCIAS
  const inputRef = useRef<InputRef>(null);
  const ciRef = useRef<HTMLInputElement>(null);

  const [hijosValue, setHijosValue] = useState("");

  const [itemHijos, setItemHijos] = useState<string[]>([]);
  const [inputVisible, setInputVisible] = useState(false);

  const showInput = () => {
    setInputVisible(true);
  };

  useEffect(() => {
    inputRef.current?.focus();
    axios.get(process.env.BACKEND_URL + "/adulto/npmunicos").then((res) => {
      let data = res.data as {
        nombres: string[];
        apellidos: string[];
      };
      let nombres = data.nombres.map((value) => {
        return { value };
      });
      let apellidos = data.apellidos.map((value) => {
        return { value };
      });
      setNombres({ nombres, apellidos });
    });
    axios.get(process.env.BACKEND_URL + "/caso/getultimo").then((res) => {
      let caso = res.data;
      if (caso) {
        let [nro, gestion] = caso.nro_caso.split("/");
        if (gestion == dayjs().year()) {
          setDatosDenuncia((value) => {
            return {
              ...value,
              nro_caso: (Number.parseInt(nro) + 1).toString(),
            };
          });
        } else {
          setDatosDenuncia((value) => {
            return {
              ...value,
              nro_caso: "1",
            };
          });
        }
      } else {
        setDatosDenuncia((value) => {
          return {
            ...value,
            nro_caso: "1",
          };
        });
      }
    });
    if (inputVisible) {
      inputRef.current?.focus();
    }
  }, []);
  const handleHijosConfirm = () => {
    if (hijosValue && itemHijos.indexOf(hijosValue) === -1) {
      setItemHijos([...itemHijos, hijosValue]);
      setInputVisible(false);
      setDatosGenerales({
        ...datosGenerales,
        hijos: [...datosGenerales.hijos, hijosValue],
      });
      setHijosValue("");
    }
  };
  //otros
  const handleOtroDomicilio = (e: ChangeEvent<HTMLInputElement>) => {
    setDatosUbicacion({
      ...datosUbicacion,
      otro_domicilio: e.target.value,
    });
  };
  const handleOtraArea = (e: ChangeEvent<HTMLInputElement>) => {
    setDatosUbicacion({
      ...datosUbicacion,
      otra_area: e.target.value,
    });
  };
  const handleHijosChange = (e: ChangeEvent<HTMLInputElement>) => {
    setHijosValue(e.target.value);
  };

  const handleClose = (removedHijo: string) => {
    const newTags = itemHijos.filter((hijo) => hijo !== removedHijo);
    setItemHijos(newTags);
    setDatosGenerales({ ...datosGenerales, hijos: newTags });
  };
  //datos extras para el formulario
  const forMap = (tag: string) => {
    const tagElem = (
      <Tag
        className="hijos"
        closable
        style={{ marginTop: -5 }}
        onClose={(e) => {
          e.preventDefault();
          handleClose(tag);
        }}
      >
        {tag}
      </Tag>
    );
    return (
      <span className="" key={tag} style={{ display: "inline-block" }}>
        {tagElem}
      </span>
    );
  };

  //DATOS DE LOS FORMULARIOS
  const handleNombre = (value: any) => {
    setDatosGenerales({ ...datosGenerales, nombre: value });
  };

  const handlePaterno = (value: any) => {
    setDatosGenerales({ ...datosGenerales, paterno: value });
  };

  const handleMaterno = (value: any) => {
    setDatosGenerales({ ...datosGenerales, materno: value });
  };

  const handleCI = (value: any) => {
    setDatosGenerales({ ...datosGenerales, ci: value });
  };

  const handlegenero = (value: any) => {
    setDatosGenerales({ ...datosGenerales, genero: value.target.value });
  };

  const handleNacimiento = (value: any) => {
    if (value) {
      let edad = -Number.parseInt(value.diff(moment.now(), "years"));
      if (edad < 60) {
        message.error({
          content: "Introduzca una edad arriba de 60 años...",
          duration: 10,
        });
      }
      setDatosGenerales({
        ...datosGenerales,
        f_nacimiento: dayjs(value.$d).format("YYYY-MM-DD"),
        edad,
      });
    }
  };

  const handleEstadoCivil = (value: any) => {
    setDatosGenerales({ ...datosGenerales, estado_civil: value });
  };

  const handleReferencia = (value: any) => {
    setDatosGenerales({ ...datosGenerales, nro_referencia: value });
  };

  const handleInstruccion = (value: any) => {
    setDatosGenerales({ ...datosGenerales, grado: value });
  };
  const handleOcupacion = (value: any) => {
    setDatosGenerales({ ...datosGenerales, ocupacion: value.target.value });
  };
  const handleBeneficios = (value: any) => {
    setDatosGenerales({ ...datosGenerales, beneficios: value });
  };
  //DATOS DE UBICACIÓN DEL ADULTO MAYOR
  const handleTipoDomicilio = (value: any) => {
    setDatosUbicacion({
      ...datosUbicacion,
      tipo_domicilio: value,
    });
  };
  const handleDistrito = (value: any) => {
    setDatosUbicacion({ ...datosUbicacion, distrito: value });
  };
  const handleZona = (value: any) => {
    setDatosUbicacion({ ...datosUbicacion, zona: value.target.value });
  };
  const handleCalle = (value: any) => {
    setDatosUbicacion({ ...datosUbicacion, calle_av: value.target.value });
  };
  const handleNroVivienda = (value: any) => {
    setDatosUbicacion({ ...datosUbicacion, nro_vivienda: value });
  };
  const handleArea = (value: any) => {
    setDatosUbicacion({ ...datosUbicacion, area: value });
  };

  const handleDescripcion = (value: any) => {
    setDescripcionHechos(value.target.value);
  };
  const handlePeticion = (value: any) => {
    setPeticion(value.target.value);
  };
  const handleNombreDenunciado = (value: any) => {
    setDatosDenunciado({ ...datosDenunciado, nombres: value });
  };

  const handlePaternoDenunciado = (value: any) => {
    setDatosDenunciado({ ...datosDenunciado, paterno: value });
  };

  const handleMaternoDenunciado = (value: any) => {
    setDatosDenunciado({ ...datosDenunciado, materno: value });
  };
  const handleParentezco = (value: any) => {
    setDatosDenunciado({ ...datosDenunciado, parentezco: value });
  };

  const handleAcciones = (value: any) => {
    setAccionRealizada(value);
  };
  const handleTipologia = (value: any) => {
    setDatosDenuncia({
      ...datosDenuncia,
      tipologia: value,
    });
  };

  return (
    <>

      <Row gutter={[24, 24]} >
        <Col span={24} offset={0} xl={{ span: 16, offset: 4 }} className="bg-white p-5 pt-2 mt-4 rounded">
          <h2 className="my-5">
            FORMULARIO DE REGISTRO DE ATENCIÓN
          </h2>
          <Form onFinish={handleOpenChange} layout="horizontal">
            <Row gutter={[24, 24]}>
              <Col span={24} lg={{ span: 10, offset: 2 }} >
                <Form.Item label={"Fecha de Registro"}>
                  <DatePicker
                    className="normal-input"
                    disabled
                    locale={
                      {
                        "lang": {
                          "placeholder": "Seleccionar fecha",
                          "rangePlaceholder": [
                            "Fecha inicial",
                            "Fecha final"
                          ],
                          shortWeekDays: dias,
                          shortMonths: meses,
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
                    } value={dayjs(dataDatosDenuncia.fecha_registro)}
                  ></DatePicker>
                </Form.Item>
              </Col>
              <Col span={24} lg={{ span: 10 }}>
                <FormItem label="Hora de registro:">
                  <TimePicker
                    className="normal-input"
                    disabled
                    defaultValue={dayjs(now())}
                  />
                </FormItem>
              </Col>
              <Col span={24} lg={{ span: 10, offset: 2 }} >
                <Form.Item label="Tipología:">
                  <Select
                    defaultValue={dataDatosDenuncia.tipologia}
                    onChange={handleTipologia}
                  >
                    <Select.Option value="Extravio">Extravío</Select.Option>
                    <Select.Option value="Maltrato">Maltrato</Select.Option>
                    <Select.Option value="Abandono">Abandono</Select.Option>
                    <Select.Option value="Despojo">Despojo</Select.Option>
                    <Select.Option value="Orientacion Legal">
                      Orientación Legal
                    </Select.Option>
                    <Select.Option value="Desaparecidos">
                      Desaparecidos
                    </Select.Option>
                    <Select.Option value="Desapoderamiento">
                      Desapoderamiento
                    </Select.Option>
                    <Select.Option value="Gestion Derechos">
                      Gestión de derechos
                    </Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={24} lg={{ span: 10 }} >
                <Form.Item label="N° de Caso:">
                  <Input
                    className="w-100"
                    suffix={"/2023"}
                    disabled
                    value={datosDenuncia.nro_caso}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Divider style={{ fontSize: 15 }} orientation="left">
              DATOS DEL ADULTO MAYOR
            </Divider>
            <Row gutter={[12, 12]}>
              <Col span={24} lg={{ span: 20, offset: 2 }} >
                <Form.Item
                  label="N° de C.I."
                  name={"ci"}
                  rules={[
                    {
                      required: true,
                      message: "Inserte el carnet de identidad",
                    },
                  ]}
                >
                  <InputNumber
                    ref={ciRef}
                    minLength={7}
                    className="normal-input"
                    placeholder="Introduzca el Nro. de C.I."
                    onChange={handleCI}
                    min={0}
                  />
                </Form.Item>
              </Col>
              <Col span={24} lg={{ span: 20, offset: 2 }}>
                <Form.Item
                  name={"nombres"}
                  rules={[
                    {
                      required: true,
                      message: "Por favor introduzca el nombre del adulto ",
                    },
                  ]}
                  label="Nombres:"
                >
                  <AutoComplete
                    options={nombres.nombres}
                    onChange={handleNombre}
                    placeholder="Introduzca el nombre del adulto mayor..."
                    className="normal-input"
                    filterOption={(inputValue, option) =>
                      option!.value
                        .toUpperCase()
                        .indexOf(inputValue.toUpperCase()) !== -1
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={24} lg={{ span: 20, offset: 2 }}>
                <Form.Item label="Apellido Paterno:">
                  <AutoComplete
                    options={nombres.apellidos}
                    onChange={handlePaterno}
                    placeholder="Introduzca su apellido paterno..."
                    filterOption={(inputValue, option) =>
                      option!.value
                        .toUpperCase()
                        .indexOf(inputValue.toUpperCase()) !== -1
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={24} lg={{ span: 20, offset: 2 }}>
                <Form.Item label="Apellido Materno:">
                  <AutoComplete
                    onChange={handleMaterno}
                    options={nombres.apellidos}
                    placeholder="Introduzca su apellido materno..."
                    filterOption={(inputValue, option) =>
                      option!.value
                        .toUpperCase()
                        .indexOf(inputValue.toUpperCase()) !== -1
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={24} lg={{ span: 12, offset: 2 }}>
                <Form.Item label={"Fecha de Nacimiento:"}>
                  <DatePicker
                    defaultValue={dayjs(datosGenerales.f_nacimiento)}
                    placeholder="Ingrese su fecha de Nacimiento"
                    className="normal-input"
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
                    onChange={handleNacimiento}
                  ></DatePicker>
                </Form.Item>
              </Col>
              <Col span={24} lg={{ span: 8 }}>
                <Form.Item
                  label="Edad"
                  rules={[
                    {
                      min: 60,
                      message: "No puede tener una edad menor a 60...",
                    },
                  ]}
                >
                  <InputNumber
                    className="normal-input"
                    min={60}
                    disabled
                    value={datosGenerales.edad}
                    name="Edad"
                  />
                </Form.Item>
              </Col>


              <Col span={24} lg={{ span: 10, offset: 2 }}>
                <Form.Item label="Expedido: ">
                  <Select
                    value={datosGenerales.expedido}
                    onChange={(ev) => {
                      setDatosGenerales({ ...datosGenerales, expedido: ev });
                    }}
                    options={departamentos}
                  ></Select>
                </Form.Item>
              </Col>
              <Col span={24} lg={{ span: 10 }} >
                <Form.Item label="Género:">
                  <Radio.Group
                    defaultValue={"Femenino"}
                    className="normal-input"
                    onChange={handlegenero}
                  >
                    <Radio value="Femenino"> Femenino </Radio>
                    <Radio value="Masculino"> Masculino </Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>

              <Col span={12} lg={{ span: 10, offset: 2 }}>
                <Form.Item className="normal-input" label="Estado Civil:">
                  <Select defaultValue={"Viudo"} onChange={handleEstadoCivil}>
                    <Select.Option value="Soltero(a)">
                      Soltero(a)
                    </Select.Option>
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
              <Col span={24} lg={{ span: 20, offset: 2 }}>
                <Form.Item
                  label="N° de Referencia:"
                  name={"referencia"}
                  rules={[
                    {
                      required: true,
                      message: "Inserte un número de referencia",
                    },
                  ]}
                >
                  <InputNumber
                    onChange={handleReferencia}
                    placeholder="Introduzca el Nro. de referencia"
                    minLength={8}
                    className="normal-input"
                  />
                </Form.Item>
              </Col>
              <Divider style={{ fontSize: 15 }} orientation="left">
                HIJOS DEL ADULTO MAYOR
              </Divider>
              <Col span={24} lg={{ span: 20, offset: 2 }}>
                <Form.Item
                  className="mt-3"
                >
                  {itemHijos.map(forMap)}
                  <Button onClick={showInput} className="tagPlus btn">
                    <PlusOutlined /> Nuevo(a) Hijo(a)
                  </Button>
                  <Input
                    onChange={handleHijosChange}
                    ref={inputRef}
                    hidden={!inputVisible}
                    placeholder="Introduzca el nombre y apellido del hijo"
                    onBlur={handleHijosConfirm}
                    onPressEnter={handleHijosConfirm}
                  />
                </Form.Item>
              </Col>
              <Divider style={{ fontSize: 15 }} orientation="left">
                DATOS CATEGÓRICOS
              </Divider>
              <Col span={24} lg={{ span: 20, offset: 2 }}>
                <Form.Item
                  className="normal-input"
                  label="Grado de Instrucción:"
                >
                  <Select
                    onChange={handleInstruccion}
                    defaultValue={"Primaria"}
                  >
                    <Select.Option value="Primaria">Primaria</Select.Option>
                    <Select.Option value="Secundaria">
                      Secundaria
                    </Select.Option>
                    <Select.Option value="Tecnico">Técnico</Select.Option>
                    <Select.Option value="Universitario">
                      Universitario
                    </Select.Option>
                    <Select.Option value="S/Inst.">
                      Sin Instrucción
                    </Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={24} lg={{ span: 20, offset: 2 }}>
                <Form.Item
                  className="normal-input"
                  label="Ocupación:"
                  name={"ocupacion"}
                  rules={[
                    {
                      required: true,
                      message: "Inserte la ocupacion...",
                    },
                  ]}
                >
                  <Input placeholder="Introduzca la ocupación del adulto mayor" onChange={handleOcupacion} />
                </Form.Item>
              </Col>
              <Col span={24} lg={{ span: 20, offset: 2 }}>
                <Form.Item className="normal-input" label="Beneficios:">
                  <Select
                    onChange={handleBeneficios}
                    value={datosGenerales.beneficios}
                  >
                    <Select.Option value="Renta Dignidad">
                      Renta Dignidad
                    </Select.Option>
                    <Select.Option value="Jubilado">Jubilado</Select.Option>
                    <Select.Option value="Ninguno">Ninguno</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Divider style={{ fontSize: 15 }} orientation="left">
                DATOS DE DOMICILIO
              </Divider>
              <Col span={24} lg={{ span: 10, offset: 2 }} >
                <Form.Item
                  className="normal-input"
                  label="Tipo de domicilio:"
                >
                  <Select
                    value={datosUbicacion.tipo_domicilio}
                    onChange={handleTipoDomicilio}
                  >
                    <Select.Option value="Propio">Propio</Select.Option>
                    <Select.Option value="Alquilado">Alquilado</Select.Option>
                    <Select.Option value="Anticretico">
                      Anticrético
                    </Select.Option>
                    <Select.Option value="Cedido">Cedido</Select.Option>
                    <Select.Option value="Otro">Otro</Select.Option>
                  </Select>
                  <Input
                    hidden={datosUbicacion.tipo_domicilio != "Otro"}
                    placeholder="Especifique"
                    className="normal-input mt-3"
                    onChange={handleOtroDomicilio}
                  />
                </Form.Item>
              </Col>
              {datosUbicacion.area == "Otro" ||
                datosUbicacion.area == "Rural" ? null : (
                <Col span={24} lg={{ span: 10 }}>
                  <Form.Item className="normal-input" label="Distrito:">
                    <Select defaultValue={1} onChange={handleDistrito}>
                      {Array.from({ length: 14 }, (_, i) => i + 1).map(
                        (value) => (
                          <Select.Option key={value} value={value}>
                            {value}
                          </Select.Option>
                        )
                      )}
                    </Select>
                  </Form.Item>
                </Col>
              )}
              <Col span={24} lg={{ span: 20, offset: 2 }}>
                <Form.Item
                  label="Zona:"
                  name={"zona"}
                  rules={[
                    {
                      required: true,
                      message: "Inserte el nombre de la zona...",
                    },
                  ]}
                >
                  <Input placeholder="Introduzca la zona del adulto mayor" className="normal-input" onChange={handleZona} />
                </Form.Item>
              </Col>
              <Col span={24} lg={{ span: 20, offset: 2 }}>
                <Form.Item
                  label="Calle o Av.:"
                  name={"calle"}
                  rules={[
                    {
                      required: true,
                      message: "Inserte el nombre de la calle...",
                    },
                  ]}
                >
                  <Input placeholder="Introduzca el nombre de la calle" className="normal-input" onChange={handleCalle} />
                </Form.Item>
              </Col>
              <Col span={24} lg={{ span: 10, offset: 2 }}>
                <Form.Item
                  label="N° de Vivienda:"
                  name={"vivienda"}
                  rules={[
                    {
                      required: true,
                      message: "Inserte el número de la vivienda...",
                    },
                  ]}
                >
                  <InputNumber
                    onChange={handleNroVivienda}
                    className="w-100"
                    placeholder="Introduzca el Nro. de vivienda"
                    min={1}
                  />
                </Form.Item>
              </Col>
              <Col span={24} lg={{ span: 10 }}>
                <Form.Item className="normal-input" label="Área:">
                  <Select
                    defaultValue={datosUbicacion.area}
                    onChange={handleArea}
                  >
                    <Select.Option value="Urbano">Urbano</Select.Option>
                    <Select.Option value="Rural">Rural</Select.Option>
                    <Select.Option value="Otro">Otro Municipio</Select.Option>
                  </Select>
                  <Input
                    hidden={datosUbicacion.area != "Otro"}
                    placeholder="Especifique"
                    className="normal-input mt-3"
                    onChange={handleOtraArea}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Divider style={{ fontSize: 15 }} orientation="left">
              DESCRIPCIÓN DE LOS HECHOS
            </Divider>
            <Row>
              <Col span={24} lg={{ span: 20, offset: 2 }}>
                <Form.Item className="w-100">
                  <TextArea
                    placeholder="Introduzca los hechos"
                    style={{ maxHeight: 200, height: 100, minHeight: 100 }}
                    onChange={handleDescripcion}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Divider style={{ fontSize: 15 }} orientation="left">
              PETICIÓN DEL ADULTO MAYOR
            </Divider>
            <Row>
              <Col span={24} lg={{ span: 20, offset: 2 }}>
                <Form.Item className="w-100">
                  <TextArea
                    placeholder="Introduzca la petición"
                    style={{ maxHeight: 200, height: 100, minHeight: 100 }}
                    onChange={handlePeticion}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Divider style={{ fontSize: 15 }} orientation="left">
              DATOS DEL DENUNCIADO
            </Divider>
            <Row gutter={[24, 24]}>
              <Col span={24} lg={{ span: 20, offset: 2 }}>
                <Form.Item
                  label="Nombres:"
                  name={"nombred"}
                  rules={[
                    {
                      required: true,
                      message: "Inserte el nombre del denunciado...",
                    },
                  ]}
                >
                  <AutoComplete
                    options={nombres.nombres}
                    onChange={handleNombreDenunciado}
                    placeholder="Introduzca el nombre..."
                    className="normal-input"
                    filterOption={(inputValue, option) =>
                      option!.value
                        .toUpperCase()
                        .indexOf(inputValue.toUpperCase()) !== -1
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={24} lg={{ span: 20, offset: 2 }}>
                <Form.Item label="Apellido Paterno:">
                  <AutoComplete
                    options={nombres.apellidos}
                    onChange={handlePaternoDenunciado}
                    placeholder="Introduzca su apellido paterno..."
                    filterOption={(inputValue, option) =>
                      option!.value
                        .toUpperCase()
                        .indexOf(inputValue.toUpperCase()) !== -1
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={24} lg={{ span: 20, offset: 2 }} >
                <Form.Item label="Apellido Materno:">
                  <AutoComplete
                    options={nombres.apellidos}
                    onChange={handleMaternoDenunciado}
                    placeholder="Introduzca su apellido materno..."
                    filterOption={(inputValue, option) =>
                      option!.value
                        .toUpperCase()
                        .indexOf(inputValue.toUpperCase()) !== -1
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={24} lg={{ span: 20, offset: 2 }}>
                <Form.Item
                  className="normal-input"
                  label="Parentezco con el adulto mayor:"
                >
                  <Select
                    defaultValue={dataDatosDenunciado.parentezco}
                    onChange={handleParentezco}
                  >
                    <Select.Option value="Hijo(a)">Hijo(a)</Select.Option>
                    <Select.Option value="Familiar">
                      Familiar Cercano
                    </Select.Option>
                    <Select.Option value="Conocido">
                      Persona Conocida
                    </Select.Option>
                    <Select.Option value="Desconocido">
                      Persona Desconocida
                    </Select.Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Divider style={{ fontSize: 15 }} orientation="left">
              ACCIONES REALIZADAS
            </Divider>
            <Row>
              <Col span={24} lg={{ span: 20, offset: 2 }}>
                <Form.Item className="normal-input">
                  <Select
                    defaultValue={accionRealizada}
                    onChange={handleAcciones}
                  >
                    <Select.Option value="Apertura">
                      Apertura de Caso
                    </Select.Option>
                    <Select.Option value="Orientacion">
                      Orientación
                    </Select.Option>
                    <Select.Option value="Citacion">Citación</Select.Option>
                    <Select.Option value="Derivacion">
                      Derivación
                    </Select.Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={14} offset={5}>
                <Form.Item>
                  <Button
                    htmlType="submit"
                    className="w-100 my-3"
                    type="primary"
                  >
                    Continuar
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
      <Modal
        title="¿Continuar?"
        open={open}
        onOk={confirm}
        onCancel={cancel}
        okText="Sí"
        cancelText="No"
      >
        <div className="column-centered">
          <QuestionCircleOutlined
            style={{ fontSize: "4em", color: "#555", marginBottom: ".5em" }}
          />
          <p className="h5 text-center">
            ¿Está seguro de pasar a la verificación de datos?
          </p>
        </div>
      </Modal>
      <FloatButton.BackTop />
    </>
  );
};

export default Formulario;
