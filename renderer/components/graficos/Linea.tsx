import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface Props {
  data: any;
  keys: any;
  keyTitle: string;
}
const GraficoLinea = ({ data, keys, keyTitle }: Props) => {
  let mainData = [];
  if (data) {
    mainData = data.map((value: any, i: number) => {
      return { [keyTitle]: keys[i], Cantidad: value };
    });
  }
  return (
    <ResponsiveContainer width={"100%"} height={350}>
      <LineChart
        data={mainData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={keyTitle} />
        <YAxis dataKey={"Cantidad"} />
        <Tooltip />
        <Legend />
        <Line dataKey={"Cantidad"} stroke="#8884d8" activeDot={{ r: 3 }} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default GraficoLinea;
