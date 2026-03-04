"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatDate } from "../utils/registrationAnalyticsUtils";

const TOOLTIP_STYLE = {
   borderRadius: "8px",
   border: "1px solid #e5e7eb",
   boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
};

interface DataPoint {
   date: string;
   fullDate: string;
   registrations: number;
}

interface RegistrationsByDayChartProps {
   data: DataPoint[];
}

export default function RegistrationsByDayChart({ data }: RegistrationsByDayChartProps) {
   return (
      <ResponsiveContainer width="100%" height="100%">
         <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
            <XAxis dataKey="date" tick={{ fill: "#6b7280", fontSize: 12 }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} tickLine={false} axisLine={false} allowDecimals={false} />
            <Tooltip
               contentStyle={TOOLTIP_STYLE}
               formatter={(value: number | undefined) => [`${value ?? 0} registro${(value ?? 0) !== 1 ? "s" : ""}`, "Registros"]}
               labelFormatter={(_, payload) => (payload?.[0]?.payload?.fullDate ? formatDate(payload[0].payload.fullDate) : "")}
            />
            <Bar dataKey="registrations" fill="#0ea5e9" radius={[4, 4, 0, 0]} name="Registros" />
         </BarChart>
      </ResponsiveContainer>
   );
}
