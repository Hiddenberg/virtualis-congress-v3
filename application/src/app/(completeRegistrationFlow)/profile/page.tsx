import { redirect } from "next/navigation";
import { getLoggedInUserId } from "@/features/staggeredAuth/services/staggeredAuthServices";
import AttendantDataFormSelector from "@/features/users/attendants/components/attendantDataForms/AttendantDataFormSelector";
import { getAttendantData } from "@/features/users/attendants/services/attendantServices";

export default async function ProfilePage() {
   const userId = await getLoggedInUserId();
   const attendantData = await getAttendantData(userId ?? "");

   if (attendantData) {
      return redirect("/payment");
   }

   return (
      <div>
         <AttendantDataFormSelector />
      </div>
   );
}
