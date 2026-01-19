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

// export function StudyGradeChart ({ data }: Props) {
//    // Group data by study grade
//    const gradeGroups = data.reduce(
//       (acc, item) => {
//          if (!item?.studiesGrade) return acc

//          if (!acc[item.studiesGrade]) {
//             acc[item.studiesGrade] = 0
//          }
//          acc[item.studiesGrade]++
//          return acc
//       },
//     {
//     } as Record<string, number>,
//    )

//    const colorPallete = ["#EFB036", "#3B6790", "#23486A", "#4C7B8B", "#6F8E8F", "#A2B0B1", "#D4D7D8", "#F0F1F2"]

//    // Convert to chart data format
//    const chartData = Object.entries(gradeGroups)
//       .map(([name, value], index) => ({
//          name,
//          value,
//          color: colorPallete[index % colorPallete.length],
//       }))

//    // Create config for the chart container
//    const config = chartData.reduce(
//       (acc, item, index) => {
//          acc[item.name] = {
//             label: item.name,
//             color: `hsl(var(--chart-${(index % 9) + 1}))`,
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
//                {chartData.map((entry, index) => (
//                   <Cell key={`cell-${index}`}
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

