"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const TOOLTIP_STYLE = {
   borderRadius: "8px",
   border: "1px solid #e5e7eb",
   boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
};

interface DataPoint {
   name: string;
   value: number;
}

interface CountriesBarChartProps {
   data: DataPoint[];
   totalCount: number;
   barColor?: string;
}

export default function CountriesBarChart({ data, totalCount, barColor = "#8b5cf6" }: CountriesBarChartProps) {
   return (
      <ResponsiveContainer width="100%" height="100%">
         <BarChart data={data} layout="vertical" margin={{ top: 8, right: 24, left: 60, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
            <XAxis
               type="number"
               tick={{ fill: "#6b7280", fontSize: 12 }}
               tickLine={false}
               axisLine={false}
               allowDecimals={false}
            />
            <YAxis
               type="category"
               dataKey="name"
               width={55}
               tick={{ fill: "#6b7280", fontSize: 12 }}
               tickLine={false}
               axisLine={false}
            />
            <Tooltip
               contentStyle={TOOLTIP_STYLE}
               formatter={(value: number | undefined, name?: string) => [
                  `${value ?? 0} registro${(value ?? 0) !== 1 ? "s" : ""} (${totalCount > 0 ? Math.round(((value ?? 0) / totalCount) * 100) : 0}%)`,
                  name ?? "",
               ]}
            />
            <Bar dataKey="value" fill={barColor} radius={[0, 4, 4, 0]} name="Registros" />
         </BarChart>
      </ResponsiveContainer>
   );
}
