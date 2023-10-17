import React, { PureComponent } from "react";
import {
  PieChart,
  Pie,
  Legend,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from "recharts";
import { getRandomHexColor } from "../usuarios/data";

interface Props {
  data: any;
  keys: any;
  keyTitle: string;
}
const GraficoPastel = ({ data, keyTitle, keys }: Props) => {
  let mainData = [];
  if (data) {
    mainData = data.map((value: any, i: number) => {
      return {
        [keyTitle]: keys[i],
        Cantidad: value,
        color: getRandomHexColor(),
      };
    });
    console.log(keys);
  }
  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie
          legendType="line"
          label
          data={mainData}
          dataKey="Cantidad"
          cx="50%"
          cy="50%"
          outerRadius={60}
          fill="#8884d8"
        >
          {mainData.map((entry: any, index: any) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>

        <Tooltip />
        <Legend verticalAlign="middle" align="right" layout="vertical" />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default GraficoPastel;
