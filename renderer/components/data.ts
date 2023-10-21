import { meses } from "./personal/data";

export const locale = {

    "lang": {
        "placeholder": "Seleccionar fecha",
        "rangePlaceholder": [
            "Fecha inicial",
            "Fecha final"
        ],
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


export const capitalize = (valor: string) => {
    let transformado = valor.toLocaleLowerCase();
    transformado = transformado[0].toUpperCase() + transformado.substring(1, transformado.length);
    return transformado.trim();
}