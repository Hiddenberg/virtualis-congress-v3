// "use client"

// import {
//    PieChart, Pie, Cell, Legend
// } from "recharts"
// import {
//    ChartContainer, ChartTooltip, ChartTooltipContent
// } from "@/components/ui/chart"

// type DataItem = {
//   isACPMember?: boolean
//   amountPaid?: number
//   studiesGrade?: string
// }

// type Props = {
//   data: DataItem[]
// }

// export function MembershipChart ({ data }: Props) {
//    // Count members and No Miembros
//    const members = data.filter((item) => item?.isACPMember).length
//    const nonMembers = data.filter((item) => item?.isACPMember === false).length

//    const chartData = [
//       {
//          name: "Miembros ACP",
//          value: members,
//          color: "#4F959D"
//       },
//       {
//          name: "No Miembros",
//          value: nonMembers,
//          color: "#98D2C0"
//       },
//    ]

//    // Create config for the chart container
//    const config = {
//       "Miembros ACP": {
//          label: "Miembros ACP",
//          color: "hsl(var(--chart-1))",
//       },
//       "No Miembros": {
//          label: "No Miembros",
//          color: "hsl(var(--chart-2))",
//       },
//    }

//    return (
//       <ChartContainer config={config}
//          className="w-full h-[300px]">
//          <PieChart>
//             <Pie
//                data={chartData}
//                dataKey="value"
//                nameKey="name"
//                cx="50%"
//                cy="50%"
//                innerRadius={60}
//                outerRadius={80}
//                paddingAngle={2}>
//                {chartData.map((entry) => (
//                   <Cell key={`cell-${entry.name}`}
//                      fill={entry.color}
//                   />
//                ))}
//             </Pie>
//             <ChartTooltip content={<ChartTooltipContent />} />
//             <Legend />
//          </PieChart>
//       </ChartContainer>
//    )
// }

