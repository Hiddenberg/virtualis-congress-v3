"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const TOOLTIP_STYLE = {
   borderRadius: "8px",
   border: "1px solid #e5e7eb",
   boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
};

interface AttendanceDataPoint {
   name: string;
   value: number;
   fill: string;
}

interface AttendanceModalityChartProps {
   data: AttendanceDataPoint[];
   totalRegistrations: number;
}

export default function AttendanceModalityChart({ data, totalRegistrations }: AttendanceModalityChartProps) {
   return (
      <ResponsiveContainer width="100%" height="100%">
         <PieChart>
            <Pie
               data={data}
               cx="50%"
               cy="50%"
               innerRadius={60}
               outerRadius={90}
               paddingAngle={2}
               dataKey="value"
               nameKey="name"
               label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
            >
               {data.map((entry) => (
                  <Cell key={entry.name} fill={entry.fill} />
               ))}
            </Pie>
            <Tooltip
               contentStyle={TOOLTIP_STYLE}
               formatter={(value: number | undefined) => [
                  `${value ?? 0} (${totalRegistrations > 0 ? Math.round(((value ?? 0) / totalRegistrations) * 100) : 0}%)`,
                  "Registros",
               ]}
            />
         </PieChart>
      </ResponsiveContainer>
   );
}
