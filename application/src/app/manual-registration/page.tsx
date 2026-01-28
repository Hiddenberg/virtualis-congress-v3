import GoBackButton from "@/components/global/GoBackButton";
import { getLatestCongress } from "@/features/congresses/services/congressServices";
import ManualRegistrationPanel from "@/features/manualRegistration/components/ManualRegistrationPanel";
import { getCongressUserRegistrationsDetails } from "@/features/manualRegistration/services/manualRegistrationServices";
import LobbyQrCodeWidget from "@/features/projectionScreen/components/LobbyQrCodeWidget";

export default async function ManualRegistrationPage() {
   const congress = await getLatestCongress();
   const userRegistrationDetails = await getCongressUserRegistrationsDetails(congress.id);
   return (
      <div>
         <GoBackButton className="mb-4" />
         <ManualRegistrationPanel congress={congress} userRegistrationDetails={userRegistrationDetails} />
         <div className="flex justify-center items-center my-8">
            <LobbyQrCodeWidget />
         </div>
      </div>
   );
}
