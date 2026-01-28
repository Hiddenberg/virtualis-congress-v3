import GoBackButton from "@/components/global/GoBackButton";
import { getAllCongressProductsWithPrices } from "@/features/congresses/services/congressProductsServices";
import { getLatestCongress } from "@/features/congresses/services/congressServices";
import ManualRegistrationPanel from "@/features/manualRegistration/components/ManualRegistrationPanel";
import { getCongressUserRegistrationsDetails } from "@/features/manualRegistration/services/manualRegistrationServices";
import LobbyQrCodeWidget from "@/features/projectionScreen/components/LobbyQrCodeWidget";

export default async function ManualRegistrationPage() {
   const congress = await getLatestCongress();
   const [userRegistrationDetails, congressProducts] = await Promise.all([
      getCongressUserRegistrationsDetails(congress.id),
      getAllCongressProductsWithPrices(congress.id),
   ]);
   return (
      <div>
         <GoBackButton className="mb-4" />
         <ManualRegistrationPanel
            congressProducts={congressProducts}
            congress={congress}
            userRegistrationDetails={userRegistrationDetails}
         />
         <div className="flex justify-center items-center my-8">
            <LobbyQrCodeWidget />
         </div>
      </div>
   );
}
