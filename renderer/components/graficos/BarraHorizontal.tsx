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
}
const GraficoBarraHorizontal = ({ data, keys, keyTitle }: Props) => {
  let mainData = [];
  if (data) {
    mainData = data.map((value: any, i: number) => {
      return {
        [keyTitle]: keys[i],
        Cantidad: value,
        color: getRandomHexColor(),
      };
    });
  }
  return (
    <>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart layout="vertical" data={mainData}>
          <CartesianGrid />
          <XAxis type="number" />
          <YAxis width={80} dataKey={keyTitle} type="category" />
          <Tooltip />
          <Legend />
          <Bar markerWidth={100} dataKey="Cantidad" barSize={20}>
            {mainData.map((entry: any, index: any) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
            <LabelList dataKey="Cantidad" position="right" fontSize={14} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </>
  );
};

export default GraficoBarraHorizontal;
