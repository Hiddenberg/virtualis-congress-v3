import { OrganizationRecord, UserPayment } from "@/types/congress";

type AttendanceModality = "in-person" | "virtual";
interface CongressRegistration {
   organization: OrganizationRecord["id"];
   user: UserRecord["id"];
   congress: CongressRecord["id"];
   paymentConfirmed: boolean;
   payment?: UserPayment["id"];
   registrationType: "regular" | "courtesy";
   attendanceModality?: AttendanceModality;
   hasAccessToRecordings: boolean;
}

type CongressRegistrationRecord = DBRecordItem<CongressRegistration>;
