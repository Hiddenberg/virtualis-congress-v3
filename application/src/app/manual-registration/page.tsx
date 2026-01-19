import GoBackButton from "@/components/global/GoBackButton";
import { getLatestCongress } from "@/features/congresses/services/congressServices";
import ManualRegistrationPanel from "@/features/manualRegistration/components/ManualRegistrationPanel";
import LobbyQrCodeWidget from "@/features/projectionScreen/components/LobbyQrCodeWidget";

export default async function ManualRegistrationPage() {
   const congress = await getLatestCongress();
   return (
      <div>
         <GoBackButton className="mb-4" />
         <ManualRegistrationPanel congress={congress} />
         <div className="flex justify-center items-center my-8">
            <LobbyQrCodeWidget />
         </div>
      </div>
   );
}
