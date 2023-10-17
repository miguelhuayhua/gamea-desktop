import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { getRandomHexColor } from "../usuarios/data";

interface Props {
  data: any;
  keys: any;
  keyTitle: string;
  colors?: string[];
}
const GraficoBarra = ({ data, keys, keyTitle, colors }: Props) => {
  let mainData = [];
  if (data) {
    if (colors) {
      mainData = data.map((value: any, i: number) => {
        return {
          [keyTitle]: keys[i],
          Cantidad: value,
          color: colors[i],
        };
      });
    } else {
      mainData = data.map((value: any, i: number) => {
        return {
          [keyTitle]: keys[i],
          Cantidad: value,
          color: getRandomHexColor(),
        };
      });
    }
  }
  return (
    <>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={mainData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid />
          <XAxis dataKey={keyTitle} />
          <YAxis />
          <Tooltip />
          <Legend />

          <Bar dataKey={"Cantidad"} label>
            {mainData.map((entry: any, index: any) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
            <LabelList dataKey="Cantidad" position="top" fontSize={16} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </>
  );
};

export default GraficoBarra;
