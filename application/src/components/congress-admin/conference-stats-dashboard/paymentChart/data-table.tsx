// "use client"

// import {
//    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
// } from "@/components/ui/table"

// type DataItem = {
//   isACPMember?: boolean
//   amountPaid?: number
//   studiesGrade?: string
//   name: string
//   date: string
// }

// type Props = {
//   data: DataItem[]
// }

// export function DataTable ({ data }: Props) {
//    return (
//       <div className="border rounded-md">
//          <div className="max-h-96 overflow-y-auto">
//             <Table className="w-full">
//                <TableHeader >
//                   <TableRow>
//                      <TableHead>Fecha</TableHead>
//                      <TableHead>Nombre</TableHead>
//                      <TableHead>Miembro ACP?</TableHead>
//                      <TableHead>Grado de estudios</TableHead>
//                      <TableHead>Monto Pagado</TableHead>
//                   </TableRow>
//                </TableHeader>
//                <TableBody>
//                   {data.map((item, index) => (
//                      <TableRow key={index}>
//                         <TableCell>
//                            {item.date}
//                         </TableCell>
//                         <TableCell>
//                            {item.name}
//                         </TableCell>
//                         <TableCell>
//                            {item?.isACPMember ? "Si" : "No"}
//                         </TableCell>
//                         <TableCell>{item?.studiesGrade || "Not specified"}</TableCell>
//                         <TableCell>${item?.amountPaid?.toLocaleString() || 0}</TableCell>
//                      </TableRow>
//                   ))}
//                </TableBody>
//             </Table>
//          </div>
//       </div>
//    )
// }

