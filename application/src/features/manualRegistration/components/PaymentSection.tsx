import { CreditCard } from "lucide-react";
import { Button } from "@/components/global/Buttons";
import type { CongressRecord } from "@/features/congresses/types/congressTypes";
import type { UserRecord } from "@/features/users/types/userTypes";
import type { CongressUserRegistrationDetails } from "../services/manualRegistrationServices";
import { ModalitySelector } from "./ModalitySelector";
import { PaymentAmountFields } from "./PaymentAmountFields";
import { RecordingsAccessToggle } from "./RecordingsAccessToggle";
import { SelectedUserDisplay } from "./SelectedUserDisplay";

interface PaymentSectionProps {
   selectedUser: UserRecord | null;
   selectedInfo: CongressUserRegistrationDetails | null;
   modality: "in-person" | "virtual" | "";
   setModality: (value: "in-person" | "virtual" | "") => void;
   grantRecordingsAccess: boolean;
   setGrantRecordingsAccess: (value: boolean) => void;
   amount: string;
   setAmount: (value: string) => void;
   discount: string;
   setDiscount: (value: string) => void;
   currency: string;
   setCurrency: (value: string) => void;
   canSubmit: boolean;
   isPending: boolean;
   onSubmit: () => void;
   congress: CongressRecord;
}

export function PaymentSection({
   selectedUser,
   selectedInfo,
   modality,
   setModality,
   grantRecordingsAccess,
   setGrantRecordingsAccess,
   amount,
   setAmount,
   discount,
   setDiscount,
   currency,
   setCurrency,
   canSubmit,
   isPending,
   onSubmit,
   congress,
}: PaymentSectionProps) {
   const isPaidSelected = !!selectedInfo?.hasPaid;

   return (
      <div className="bg-white shadow-sm border border-gray-200 rounded-xl">
         <div className="p-6 border-gray-100 border-b">
            <div className="flex items-center gap-3">
               <div className="flex justify-center items-center bg-green-100 rounded-lg w-10 h-10">
                  <CreditCard className="text-green-600" size={20} />
               </div>
               <div>
                  <h2 className="font-semibold text-gray-900 text-lg">Registro de Pago</h2>
                  <p className="text-gray-600 text-sm">Configura el pago manual del usuario</p>
               </div>
            </div>
         </div>

         <div className="space-y-6 p-6">
            <SelectedUserDisplay selectedUser={selectedUser} hasPaid={isPaidSelected} />

            <ModalitySelector modality={modality} setModality={setModality} isPaidSelected={isPaidSelected} congress={congress} />

            <RecordingsAccessToggle
               grantRecordingsAccess={grantRecordingsAccess}
               setGrantRecordingsAccess={setGrantRecordingsAccess}
               isPaidSelected={isPaidSelected}
            />

            <PaymentAmountFields
               amount={amount}
               setAmount={setAmount}
               discount={discount}
               setDiscount={setDiscount}
               currency={currency}
               setCurrency={setCurrency}
            />

            <div className="pt-4 border-gray-100 border-t">
               <Button
                  type="button"
                  onClick={onSubmit}
                  disabled={!canSubmit || isPending || !modality}
                  loading={isPending}
                  variant="blue"
                  className="w-full"
               >
                  {isPending ? "Procesando pago..." : "Registrar Pago Manual"}
               </Button>
            </div>
         </div>
      </div>
   );
}
