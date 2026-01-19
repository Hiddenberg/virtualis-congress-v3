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

// const colorPallete = [
//    "#050201",
//    "#8a513b",
//    "#2ba8ad",
//    "#f2a12b",
//    "#124c59",
//    "#768e91",
//    "#06999e",
// ]

// export function PaymentChart ({ data }: Props) {
//    // Group data by payment amount categories
//    const paymentGroups = data.reduce(
//       (acc, item) => {
//          const amount = item?.amountPaid || 0
//          let category

//          if (amount === 0) {
//             category = "Residentes/Estudiantes Miembros Del ACP"
//          } else if (amount <= 250) {
//             category = "Estudiantes No Miembros"
//          } else if (amount <= 500) {
//             category = "Residentes No Miembros / Especialistas Miembros"
//          } else if (amount <= 1000) {
//             category = "Afiliado CMIM"
//          } else if (amount <= 1500) {
//             category = "Médico General"
//          } else {
//             category = "Médico Otra Especialidad"
//          }

//          if (!acc[category]) {
//             acc[category] = 0
//          }
//          acc[category]++
//          return acc
//       },
//     {
//     } as Record<string, number>,
//    )

//    // Convert to chart data format and sort by payment category
//    const categories = ["Residentes/Estudiantes Miembros Del ACP", "Estudiantes No Miembros", "Residentes No Miembros / Especialistas Miembros", "Afiliado CMIM", "Médico General", "Médico Otra Especialidad"]
//    const chartData = categories
//       .filter((category) => paymentGroups[category])
//       .map((category) => ({
//          name: category,
//          value: paymentGroups[category],
//       }))

//    // Create config for the chart container
//    const config = chartData.reduce(
//       (acc, item, index) => {
//          const hue = (index * 36) % 360;
//          acc[item.name] = {
//             label: item.name,
//             color: `hsl(${hue}, 58%, 39%)`,
//          }
//          return acc
//       },
//     {
//     } as Record<string, { label: string; color: string }>,
//    )

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
//                {chartData.map((entry, index) => {
//                   return (
//                      <Cell key={`cell-${index}`}
//                         fill={colorPallete[index % colorPallete.length]}
//                      />
//                   )})}
//             </Pie>
//             <ChartTooltip content={<ChartTooltipContent />} />
//             <Legend />
//          </PieChart>
//       </ChartContainer>
//    )
// }

