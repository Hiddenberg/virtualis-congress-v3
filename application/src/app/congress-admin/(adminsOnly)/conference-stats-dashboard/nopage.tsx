// import { AccumulativeGainsChart } from "@/components/congress-admin/conference-stats-dashboard/AccumulativeGainsChart";
// import { NewRegistersChart } from "@/components/congress-admin/conference-stats-dashboard/NewRegistersChart";
// import PaymentsDataSection from "@/components/congress-admin/conference-stats-dashboard/paymentChart/dashboard";
// import { TEMP_CONSTANTS } from "@/data/tempConstants";
// import pbServerClient from "@/libs/pbServerClient";
// import { checkAuthorizedUserFromServer } from "@/services/authServices";
// import { getAllPayments } from "@/services/paymentServices";
// import { AttendantData, User } from "@/types/congress";
// import PB_COLLECTIONS from "@/types/constants/pocketbaseCollections";
// import { getPaymentsCollected } from "@/utils/dataConversionUtils";
// import { notFound } from "next/navigation";
// import { RecordModel } from "pocketbase";
// export interface NewRegistrationsData {
//    date: string;
//    newRegistrations: number;
// }

// export const dynamic = "force-dynamic"

// export default async function ConferenceStatsDashboardPage () {
//    const isAuthorized = await checkAuthorizedUserFromServer(["super_admin"])

//    if (!isAuthorized) {
//       notFound()
//    }

//    const allPayments = await getAllPayments(TEMP_CONSTANTS.ORGANIZATION_ID)
//    const allAttendantsData = await pbServerClient.collection(PB_COLLECTIONS.ATTENDANTS_DATA)
//       .getFullList<AttendantData & RecordModel>()
//    const filter = `user.congress_registrations_via_userRegistered.paymentConfirmed = true`
//    const attendantsWithPaymentConfirmed = await pbServerClient.collection(PB_COLLECTIONS.ATTENDANTS_DATA)
//       .getFullList<AttendantData & RecordModel & { expand: { user: User & RecordModel } }>({
//          filter,
//          expand: "user"
//       })
//    const paymentsCollected = getPaymentsCollected(attendantsWithPaymentConfirmed, allPayments)

//    const totalRegistrations = allAttendantsData.length

//    return (
//       <div className="px-4 sm:px-6 lg:px-8 py-6">
//          <div className="mb-8">
//             <h1 className="font-bold text-4xl">Estadisticas del congreso</h1>
//             <p className="font-medium text-muted-foreground text-lg">
//                Congreso Internacional de Medicina Interna
//             </p>
//          </div>

//          <div className="space-y-8">
//             <NewRegistersChart allAttendantsRegisteredData={allAttendantsData} />
//             <AccumulativeGainsChart allPayments={allPayments} />
//             <PaymentsDataSection paymentsData={paymentsCollected}
//                totalRegistrations={totalRegistrations}
//             />
//          </div>
//       </div>
//    );
// }
