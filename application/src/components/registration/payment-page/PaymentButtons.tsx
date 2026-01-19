import { LinkButton } from "@/components/global/Buttons";
import CuponCodePopUpButton from "./CuponCodePopUpButton";
import PayWithBankTransferButton from "./PayWithBankTransferButton";

export default function PaymentButtons() {
   return (
      <div className="flex flex-col justify-center items-center gap-5 mx-auto w-full md:w-2/5 *:w-full">
         <LinkButton
            href="/api/create-checkout-session"
            className="bg-yellow-400 px-4 py-3 rounded-xl w-max text-xl text-center transition-colors"
         >
            Realizar Pago
         </LinkButton>

         <PayWithBankTransferButton />

         <CuponCodePopUpButton />
      </div>
   );
}
