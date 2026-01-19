// "use client"

// import {
//    Bar, BarChart, CartesianGrid, XAxis
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
// import { AttendantData } from "@/types/congress"
// import { RecordModel } from "pocketbase"
// import { getNewRegistrationsPerDay } from "@/utils/dataConversionUtils"
// import { useMemo } from "react"
// import { format } from "@formkit/tempo"

// export const description = "Nuevos Registros por día"

// const chartConfig = {
//    newRegistrations: {
//       label: "Nuevos registros",
//       color: "red",
//    },
// } satisfies ChartConfig

// export function NewRegistersChart ({ allAttendantsRegisteredData }: {allAttendantsRegisteredData: (AttendantData & RecordModel)[]}) {
//    const registrationsPerDay = useMemo(() => getNewRegistrationsPerDay(allAttendantsRegisteredData),
//       [allAttendantsRegisteredData]
//    )
//    const total = useMemo(() => ({
//       newRegistrations: registrationsPerDay.reduce((acc, curr) => acc + curr.newRegistrations, 0),
//    }),
//    [registrationsPerDay])

//    return (
//       <div>
//          <h1 className="mb-4 font-bold text-2xl tracking-tight">Registros</h1>

//          <Card>
//             <CardHeader className="flex sm:flex-row flex-col items-stretch space-y-0 p-0 border-b">
//                <div className="flex flex-col flex-1 justify-center gap-1 px-6 py-5 sm:py-6">
//                   <CardTitle>Nuevos registros por día</CardTitle>
//                   <CardDescription>
//                      Mostrando los nuevos registros por día
//                   </CardDescription>
//                </div>
//                <div className="flex">
//                   <button
//                      key={"newRegistrations"}
//                      data-active={"newRegistrations"}
//                      className="z-30 relative flex flex-col flex-1 justify-center gap-1 data-[active=true]:bg-muted/50 px-6 sm:px-8 py-4 sm:py-6 border-t sm:border-t-0 sm:border-l even:border-l text-left">
//                      <span className="text-muted-foreground text-xs">
//                         Total de personas registradas
//                      </span>
//                      <span className="font-bold text-lg sm:text-3xl leading-none">
//                         {total.newRegistrations.toLocaleString()}
//                      </span>
//                   </button>
//                </div>
//             </CardHeader>
//             <CardContent className="sm:p-6 px-2">
//                <ChartContainer
//                   config={chartConfig}
//                   className="w-full h-[250px] aspect-auto">
//                   <BarChart
//                      accessibilityLayer
//                      data={registrationsPerDay}
//                      margin={{
//                         left: 12,
//                         right: 12,
//                      }}>
//                      <CartesianGrid vertical={false} />
//                      <XAxis
//                         dataKey="date"
//                         tickLine={false}
//                         axisLine={false}
//                         tickMargin={8}
//                         minTickGap={32}
//                         tickFormatter={(value) => {
//                            return format({
//                               date: value,
//                               format: "DD MMM",
//                               locale: "es-MX",
//                               tz: "America/Mexico_City"
//                            })
//                         }}
//                      />
//                      <ChartTooltip
//                         content={(
//                            <ChartTooltipContent
//                               className="w-[150px]"
//                               nameKey="newRegistrations"
//                               labelFormatter={(value) => {
//                                  return new Date(value)
//                                     .toLocaleDateString("es-MX", {
//                                        month: "short",
//                                        day: "numeric",
//                                        year: "numeric",
//                                     })
//                               }}
//                            />
//                         )}
//                      />
//                      <Bar dataKey={"newRegistrations"}
//                         fill={`black`}
//                      />
//                   </BarChart>
//                </ChartContainer>
//             </CardContent>
//          </Card>
//       </div>
//    )
// }
