"use client";

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { CHART_COLORS } from "../utils/registrationAnalyticsUtils";

const TOOLTIP_STYLE = {
   borderRadius: "8px",
   border: "1px solid #e5e7eb",
   boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
};

interface DataPoint {
   name: string;
   value: number;
}

interface DistributionPieChartProps {
   data: DataPoint[];
   totalCount: number;
}

export default function DistributionPieChart({ data, totalCount }: DistributionPieChartProps) {
   return (
      <ResponsiveContainer width="100%" height="100%">
         <PieChart>
            <Pie data={data} cx="50%" cy="50%" innerRadius={50} outerRadius={85} paddingAngle={2} dataKey="value" nameKey="name">
               {data.map((entry, idx) => (
                  <Cell key={entry.name} fill={CHART_COLORS[idx % CHART_COLORS.length]} />
               ))}
            </Pie>
            <Tooltip
               contentStyle={TOOLTIP_STYLE}
               formatter={(value: number | undefined, name?: string) => [
                  `${value ?? 0} (${totalCount > 0 ? Math.round(((value ?? 0) / totalCount) * 100) : 0}%)`,
                  name ?? "",
               ]}
            />
            <Legend />
         </PieChart>
      </ResponsiveContainer>
   );
}
