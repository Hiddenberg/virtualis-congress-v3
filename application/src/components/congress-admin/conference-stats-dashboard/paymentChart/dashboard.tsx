// "use client"

// import {
//    Card, CardContent, CardDescription, CardHeader, CardTitle
// } from "@/components/ui/card"
// import {
//    Tabs, TabsContent, TabsList, TabsTrigger
// } from "@/components/ui/tabs"
// import { StudyGradeChart } from "./study-grade-chart"
// import { MembershipChart } from "./membership-chart"
// import { PaymentChart } from "./payment-chart"
// import { DataTable } from "./data-table"
// // Filter out null entries and process the data

// interface DataItem {
//   isACPMember?: boolean
//   amountPaid?: number
//   studiesGrade?: string
//   name: string
//   date: string
// }
// export default function PaymentsDataSection ({
//    paymentsData, totalRegistrations
// }: {paymentsData: (DataItem | null)[], totalRegistrations: number}) {
//    const data = paymentsData.filter((entry) => entry !== null)
//    return (
//       <div className="flex flex-col gap-4">
//          <h1 className="font-bold text-2xl tracking-tight">Inscripciones Y Pagos</h1>

//          <Tabs defaultValue="charts"
//             className="w-full">
//             <TabsList>
//                <TabsTrigger value="charts">Gráficos</TabsTrigger>
//                <TabsTrigger value="data">Tabla de datos</TabsTrigger>
//             </TabsList>
//             <TabsContent value="charts"
//                className="space-y-4">
//                <div className="gap-4 grid md:grid-cols-2 lg:grid-cols-3">
//                   <Card>
//                      <CardHeader>
//                         <CardTitle>Grados de estudios</CardTitle>
//                         <CardDescription>Registros confirmados por grado de estudios</CardDescription>
//                      </CardHeader>
//                      <CardContent>
//                         <StudyGradeChart data={data} />
//                      </CardContent>
//                   </Card>

//                   <Card>
//                      <CardHeader>
//                         <CardTitle>Miembros ACP</CardTitle>
//                         <CardDescription>Registros confirmados: miembros ACP vs no miembros</CardDescription>
//                      </CardHeader>
//                      <CardContent>
//                         <MembershipChart data={data} />
//                      </CardContent>
//                   </Card>

//                   <Card>
//                      <CardHeader>
//                         <CardTitle>Distribución de pagos</CardTitle>
//                         <CardDescription>Distribución por precio aplicado</CardDescription>
//                      </CardHeader>
//                      <CardContent>
//                         <PaymentChart data={data} />
//                      </CardContent>
//                   </Card>
//                </div>

//                <Card>
//                   <CardHeader>
//                      <CardTitle className="mx-auto text-xl">Resumen</CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                      <div className="*:flex *:flex-col justify-center items-start *:items-center gap-4 grid md:grid-cols-2 lg:grid-cols-3">
//                         <div className="divide-y-2">
//                            <div className="flex flex-col items-center p-4">
//                               <p className="font-medium text-muted-foreground text-sm">Total De Personas Registradas</p>
//                               <p className="font-bold text-2xl">{totalRegistrations}</p>
//                            </div>
//                            <div className="flex flex-col items-center p-4">
//                               <p className="font-medium text-muted-foreground text-sm">Total De Inscripciones con Pagos Confirmados</p>
//                               <p className="font-bold text-2xl">{data.length}</p>
//                            </div>
//                         </div>

//                         <div className="*:py-4 divide-y-2">
//                            <div className="text-center">
//                               <p className="font-medium text-muted-foreground text-sm">Inscripciones Gratuitas</p>
//                               <p className="font-bold text-2xl">
//                                  {data.reduce((prev, inscription) => (inscription.amountPaid === 0 ? prev + 1 : prev), 0)}
//                               </p>
//                            </div>
//                            <div className="text-center">
//                               <p className="font-medium text-muted-foreground text-sm">Inscripciones Pagadas</p>
//                               <p className="font-bold text-2xl">
//                                  {data.reduce((prev, inscription) => (inscription.amountPaid! > 0 ? prev + 1 : prev), 0)}
//                               </p>
//                            </div>
//                         </div>
//                         <div>
//                            <p className="font-medium text-muted-foreground text-sm">Pago promedio</p>
//                            <p className="font-bold text-2xl">
//                               ${Math.round(data.filter(item => item.amountPaid! > 0)
//                                  .reduce((sum, d) => sum + (d?.amountPaid || 0), 0) / data.filter(item => item.amountPaid! > 0).length)
//                                  .toLocaleString()}
//                            </p>
//                         </div>
//                      </div>
//                   </CardContent>
//                </Card>
//             </TabsContent>

//             <TabsContent value="data">
//                <Card>
//                   <CardHeader>
//                      <CardTitle>Datos</CardTitle>
//                      <CardDescription>Lista completa de pagos confirmados</CardDescription>
//                   </CardHeader>
//                   <CardContent>
//                      <DataTable data={data.sort((a, b) => {
//                         return new Date(b.date)
//                            .getTime() - new Date(a.date)
//                            .getTime()
//                      })}
//                      />
//                   </CardContent>
//                </Card>
//             </TabsContent>
//          </Tabs>
//       </div>
//    )
// }

