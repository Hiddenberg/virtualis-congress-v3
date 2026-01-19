import { CheckCircle, Monitor, Users, Video } from "lucide-react";
import type { CongressRegistrationRecord } from "@/features/congresses/types/congressRegistrationTypes";

interface AttendanceBreakdownProps {
   registrations: CongressRegistrationRecord[];
}

export default function AttendanceBreakdown({
   registrations,
}: AttendanceBreakdownProps) {
   const paidRegistrations = registrations.filter(
      (reg) => reg.paymentConfirmed,
   );

   const inPersonCount = paidRegistrations.filter(
      (reg) => reg.attendanceModality === "in-person",
   ).length;
   const virtualCount = paidRegistrations.filter(
      (reg) => reg.attendanceModality === "virtual",
   ).length;
   // const unspecifiedCount = paidRegistrations.filter(reg => !reg.attendanceModality).length;
   const recordingAccessCount = paidRegistrations.filter(
      (reg) => reg.hasAccessToRecordings,
   ).length;

   const attendanceData = [
      {
         title: "Asistencia Presencial",
         count: inPersonCount,
         icon: Users,
         color: "bg-blue-50 text-blue-600",
         bgColor: "bg-blue-500",
      },
      {
         title: "Asistencia Virtual",
         count: virtualCount,
         icon: Monitor,
         color: "bg-green-50 text-green-600",
         bgColor: "bg-green-500",
      },
      // {
      //    title: "Modalidad No Especificada",
      //    count: unspecifiedCount,
      //    icon: Users,
      //    color: "bg-gray-50 text-gray-600",
      //    bgColor: "bg-gray-500"
      // },
      {
         title: "Acceso a Grabaciones",
         count: recordingAccessCount,
         icon: Video,
         color: "bg-purple-50 text-purple-600",
         bgColor: "bg-purple-500",
      },
   ];

   return (
      <div className="bg-white shadow-sm border border-gray-200 rounded-xl">
         <div className="p-6 border-gray-200 border-b">
            <h2 className="font-semibold text-gray-900 text-xl">
               Modalidades de Asistencia
            </h2>
            <p className="mt-1 text-gray-600">
               Distribución de tipos de asistencia y accesos
            </p>
         </div>

         <div className="p-6">
            <div className="gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
               {attendanceData.map((item, index) => (
                  <div key={index} className="text-center">
                     <div
                        className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-3 ${item.color}`}
                     >
                        <item.icon className="w-8 h-8" />
                     </div>
                     <div className="mb-2 font-bold text-gray-900 text-3xl">
                        {item.count}
                     </div>
                     <div className="font-medium text-gray-600 text-sm">
                        {item.title}
                     </div>
                     {paidRegistrations.length > 0 && (
                        <div className="mt-1 text-gray-500 text-xs">
                           {Math.round(
                              (item.count / paidRegistrations.length) * 100,
                           )}
                           % del total
                        </div>
                     )}
                  </div>
               ))}
            </div>

            {paidRegistrations.length > 0 && (
               <div className="bg-gray-50 mt-8 p-4 rounded-lg">
                  <div className="flex justify-center items-center space-x-2 text-gray-600 text-sm">
                     <CheckCircle className="w-4 h-4 text-green-500" />
                     <span>
                        Datos basados en {paidRegistrations.length} registros
                        con pago confirmado
                     </span>
                  </div>
               </div>
            )}
         </div>
      </div>
   );
}
