import AttendanceBreakdown from "@/components/congress-admin/registration-metrics/AttendanceBreakdown";
import DetailedMetricsGrid from "@/components/congress-admin/registration-metrics/DetailedMetricsGrid";
import PaidUsersList from "@/components/congress-admin/registration-metrics/PaidUsersList";
import PaymentMetricsGrid from "@/components/congress-admin/registration-metrics/PaymentMetricsGrid";
import RegisteredPeopleList from "@/components/congress-admin/registration-metrics/RegisteredPeopleList";
import RegistrationOverview from "@/components/congress-admin/registration-metrics/RegistrationOverview";
import { getCongressUserRegistrationsDetailsOptimized } from "@/features/manualRegistration/services/manualRegistrationServices";
import { getAllOrganizationCompletedPaymentsWithUsers } from "@/features/organizationPayments/services/organizationPaymentsServices";

export default async function RegistrationMetricsPage() {
   console.time("getCongressUserRegistrationsDetailsOptimized");
   const [completedPayments, congressRegistrationsDetails] = await Promise.all([
      getAllOrganizationCompletedPaymentsWithUsers(),
      getCongressUserRegistrationsDetailsOptimized(),
   ]);
   const congressRegistrations = congressRegistrationsDetails.map((detail) => detail.congressRegistration);
   console.timeEnd("getCongressUserRegistrationsDetailsOptimized");

   return (
      <div className="bg-gray-50 p-6 min-h-screen">
         <div className="space-y-8 mx-auto max-w-7xl">
            {/* Header */}
            <div className="pb-6 border-gray-200 border-b">
               <h1 className="font-bold text-gray-900 text-3xl">Métricas de Registro del Congreso</h1>
               <p className="mt-2 text-gray-600">Resumen completo de registros y pagos del congreso</p>
            </div>

            {/* Overview Section */}
            <RegistrationOverview registrations={congressRegistrations} payments={completedPayments} />

            {/* Payment Metrics */}
            <PaymentMetricsGrid registrations={congressRegistrations} payments={completedPayments} />

            {/* Attendance Breakdown */}
            <AttendanceBreakdown registrationsDetails={congressRegistrationsDetails} />

            {/* Detailed Metrics */}
            <DetailedMetricsGrid registrations={congressRegistrations} payments={completedPayments} />

            {/* Registered People List */}
            <RegisteredPeopleList registrationsDetails={congressRegistrationsDetails} />

            {/* Paid Users List */}
            <PaidUsersList registrationsDetails={congressRegistrationsDetails} payments={completedPayments} />
         </div>
      </div>
   );
}
