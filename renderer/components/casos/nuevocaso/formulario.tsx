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
    props.getDatos({
      datosGenerales,
      datosUbicacion,
      datosDenunciado,
      descripcionHechos,
      descripcionPeticion,
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
  const [hijosValue, setHijosValue] = useState("");
  const [itemHijos, setItemHijos] = useState<string[]>([]);
  const [inputVisible, setInputVisible] = useState(false);

  const showInput = () => {
    setInputVisible(true);
  };

  useEffect(() => {
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
      <h2 style={{ fontWeight: "bold", color: "#064450" }}>
        FORMULARIO DE REGISTRO DE ATENCIÓN
      </h2>
      <Row gutter={[24, 24]}>
        <Col span={24} offset={0} md={{ span: 20, offset: 2 }}>
          <Form onFinish={handleOpenChange} layout="horizontal">
            <Row gutter={[24, 24]}>
              <Col span={24} lg={{ span: 12 }} xxl={{ span: 6 }}>
                <Form.Item label={"Fecha de Registro"}>
                  <DatePicker
                    className="normal-input"
                    disabled
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
                    value={dayjs(dataDatosDenuncia.fecha_registro)}
                  ></DatePicker>
                </Form.Item>
              </Col>
              <Col span={24} lg={{ span: 12 }} xxl={{ span: 6 }}>
                <FormItem label="Hora de registro:">
                  <TimePicker
                    className="normal-input"
                    disabled
                    defaultValue={dayjs(now())}
                  />
                </FormItem>
              </Col>
              <Col span={12} md={{ span: 12 }} xl={{ span: 6 }}>
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
              <Col span={12} md={{ span: 12 }} xl={{ span: 6 }}>
                <Form.Item label="N° de Caso:">
                  <Input
                    className="small-input"
                    suffix={"/2023"}
                    disabled
                    value={datosDenuncia.nro_caso}
                  />
                </Form.Item>
              </Col>
            </Row>
            <div className="border position-relative rounded p-4">
              <p className="titulo-form">
                1. Datos Generales de la persona adulta mayor
              </p>
              <Row gutter={[12, 12]}>
                <Col span={24} xl={{ span: 12 }} xxl={{ span: 8 }}>
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
                <Col span={24} xl={{ span: 12 }} xxl={{ span: 8 }}>
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
                <Col span={24} xl={{ span: 12 }} xxl={{ span: 8 }}>
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
                <Col span={24} lg={{ span: 16 }} xl={{ span: 8 }}>
                  <Form.Item label={"Fecha de Nacimiento:"}>
                    <DatePicker
                      defaultValue={dayjs(datosGenerales.f_nacimiento)}
                      placeholder="Ingrese su fecha de Nacimiento"
                      className="normal-input"
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
                          yearSelect: "Seleccione año",
                        },
                        timePickerLocale: {
                          placeholder: "Seleccionar hora",
                          rangePlaceholder: ["Hora de inicio", "Hora de fin"],

                        },
                        // Otras propiedades del objeto locale


                      }}
                      onChange={handleNacimiento}
                    ></DatePicker>
                  </Form.Item>
                </Col>
                <Col span={6}>
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

                <Col span={18} md={{ span: 12 }} xl={{ span: 4 }}>
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
                      minLength={7}
                      className="normal-input"
                      onChange={handleCI}
                      name={"ci"}
                    />
                  </Form.Item>
                </Col>
                <Col span={6}>
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
                <Col span={10} md={{ span: 12 }} xl={{ span: 6 }}>
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

                <Col span={12} xl={{ span: 6 }}>
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
                <Col span={24} lg={{ span: 12 }}>
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
                      minLength={8}
                      className="normal-input"
                    />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Divider style={{ fontSize: 12 }} orientation="left">
                    HIJOS DEL ADULTO MAYOR
                  </Divider>
                  <Form.Item
                    className="normal-input mt-3"
                    label="Hijos del adulto mayor"
                  >
                    {itemHijos.map(forMap)}
                    <Button onClick={showInput} className="tagPlus btn">
                      <PlusOutlined /> Nuevo(a) Hijo(a)
                    </Button>

                    <Input
                      onChange={handleHijosChange}
                      className="normal-input"
                      ref={inputRef}
                      hidden={!inputVisible}
                      onBlur={handleHijosConfirm}
                      onPressEnter={handleHijosConfirm}
                    />
                  </Form.Item>
                  <hr className="mb-3" />
                </Col>
                <Col span={24} lg={{ span: 12 }} xl={{ span: 8 }}>
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
                <Col span={24} lg={{ span: 12 }} xl={{ span: 8 }}>
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
                    <Input onChange={handleOcupacion} />
                  </Form.Item>
                </Col>
                <Col span={24} lg={{ span: 12 }} xl={{ span: 8 }}>
                  <Form.Item className="normal-input" label="Beneficios:">
                    <Select
                      onChange={handleBeneficios}
                      defaultValue={"Ninguno"}
                    >
                      <Select.Option value="Renta Dignidad">
                        Renta Dignidad
                      </Select.Option>
                      <Select.Option value="Jubilado">Jubilado</Select.Option>
                      <Select.Option value="Ninguno">Ninguno</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={24} md={{ span: 14 }} xl={{ span: 8 }}>
                  <Form.Item
                    className="normal-input"
                    label="Tipo de domicilio:"
                  >
                    <Select
                      defaultValue={"Propio"}
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
                  <Col span={24} md={{ span: 10 }} xl={{ span: 4 }}>
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
                <Col span={24} xl={{ span: 12 }}>
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
                    <Input className="normal-input" onChange={handleZona} />
                  </Form.Item>
                </Col>
                <Col span={24} xl={{ span: 12 }}>
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
                    <Input className="normal-input" onChange={handleCalle} />
                  </Form.Item>
                </Col>
                <Col span={24} md={{ span: 10 }} xl={{ span: 6 }}>
                  <Form.Item
                    label="N° de vivienda:"
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
                      className="normal-input"
                      min={1}
                    />
                  </Form.Item>
                </Col>
                <Col span={24} md={{ span: 14 }} xl={{ span: 6 }}>
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
            </div>
            <div className="border position-relative rounded p-4 mt-4">
              <p className="titulo-form">2. Descripcion de los hechos</p>
              <Row>
                <Col span={24}>
                  <Form.Item className="w-100">
                    <TextArea
                      style={{ maxHeight: 200, height: 150, minHeight: 150 }}
                      onChange={handleDescripcion}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </div>
            <div className="border position-relative rounded p-4 mt-4">
              <p className="titulo-form">
                3. Petición de la persona adulta mayor
              </p>
              <Row>
                <Col span={24}>
                  <Form.Item className="w-100">
                    <TextArea
                      style={{ maxHeight: 200, height: 150, minHeight: 150 }}
                      onChange={handlePeticion}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </div>
            <div className="border position-relative rounded p-4 mt-4">
              <p className="titulo-form">4. Datos personales del denunciado</p>
              <Row gutter={[24, 24]}>
                <Col span={24} lg={{ span: 12 }} xxl={{ span: 8 }}>
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
                <Col span={24} lg={{ span: 12 }} xxl={{ span: 8 }}>
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
                <Col span={24} lg={{ span: 12 }} xl={{ span: 8 }}>
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
                <Col span={24} lg={{ span: 12 }}>
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
            </div>
            <div className="border position-relative rounded p-4 mt-4">
              <p className="titulo-form">5. Acciones Realizadas</p>
              <Row>
                <Col offset={4} span={16} md={{ span: 16 }}>
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
            </div>
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
