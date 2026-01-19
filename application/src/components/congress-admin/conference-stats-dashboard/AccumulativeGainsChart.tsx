// "use client"

// import {
//    Area, AreaChart, CartesianGrid, XAxis, YAxis
// } from "recharts"
// import {
//    Card,
//    CardContent,
//    CardDescription,
//    CardHeader,
//    CardTitle,
// } from "@/components/ui/card"
// import {
//    ChartConfig,
//    ChartContainer,
//    ChartTooltip,
//    ChartTooltipContent,
// } from "@/components/ui/chart"
// import { UserPayment } from "@/types/congress"
// import { RecordModel } from "pocketbase"
// import { useMemo } from "react"
// import { getAccumulatedGainsPerDay } from "@/utils/dataConversionUtils"
// import { format } from "@formkit/tempo"

// const chartConfig = {
//    accumulatedGains: {
//       label: "Ganancias Totales",
//       color: "green",
//    },
// } satisfies ChartConfig

// export function AccumulativeGainsChart ({ allPayments }: {allPayments: (UserPayment & RecordModel)[]}) {
//    const accumulatedGainsPerDay = useMemo(() => getAccumulatedGainsPerDay(allPayments),[allPayments])
//    const totalGains = accumulatedGainsPerDay[accumulatedGainsPerDay.length - 1].accumulatedGains.toLocaleString()
//    return (
//       <div>
//          <h1 className="mb-4 font-bold text-2xl tracking-tight">Ganancias</h1>
//          <Card>
//             <CardHeader>
//                <CardTitle>Ganancias Acumuladas Durante Los Últimos {accumulatedGainsPerDay.length} Días</CardTitle>
//                <CardDescription>Ganancias Totales: <strong>${totalGains}</strong></CardDescription>
//             </CardHeader>
//             <CardContent>
//                <ChartContainer config={chartConfig}>
//                   <AreaChart
//                      accessibilityLayer
//                      data={accumulatedGainsPerDay}
//                      margin={{
//                         left: 12,
//                         right: 12,
//                      }}>
//                      <CartesianGrid vertical={true} />
//                      <XAxis
//                         dataKey="date"
//                         local="es-MX"
//                         tickLine={true}
//                         axisLine={false}
//                         tickMargin={8}
//                         tickFormatter={(value) => format(value, "DD/MMM", "es-mx")}
//                      />
//                      <YAxis
//                         axisLine={false}
//                         tickFormatter={(value) => `$${value}`}
//                      />
//                      <ChartTooltip cursor={false}
//                         content={<ChartTooltipContent />}
//                      />
//                      <defs>
//                         <linearGradient id="fillAccumulatedGains"
//                            x1="0"
//                            y1="0"
//                            x2="0"
//                            y2="1">
//                            <stop
//                               offset="5%"
//                               stopColor="var(--color-accumulatedGains)"
//                               stopOpacity={0.9}
//                            />

//                            <stop
//                               offset="50%"
//                               stopColor="var(--color-accumulatedGains)"
//                               stopOpacity={0.5}
//                            />
//                            <stop
//                               offset="95%"
//                               stopColor="var(--color-accumulatedGains)"
//                               stopOpacity={0.1}
//                            />
//                         </linearGradient>
//                      </defs>
//                      <Area
//                         dataKey="accumulatedGains"
//                         type="basis"
//                         fill="url(#fillAccumulatedGains)"
//                         fillOpacity={0.4}
//                         stroke="var(--color-accumulatedGains)"
//                         stackId="a"
//                      />
//                   </AreaChart>
//                </ChartContainer>
//             </CardContent>
//          </Card>
//       </div>
//    )
// }
