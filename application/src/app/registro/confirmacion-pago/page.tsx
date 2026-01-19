import LoginRequiredPage from "@/components/global/redirectors/LoginRequiredPage";
import HeaderBlack from "@/components/registration/HeaderBlack";
import PaymentStatusMessage from "@/components/registration/payment-page/ConfirmedPayment";

export default function ConfirmedPaymentPage() {
   return (
      <LoginRequiredPage>
         <div className="p-4 md:px-10">
            <HeaderBlack />
            <div className="flex flex-col justify-center items-center space-y-10 bg-[#F5F6FA] md:mx-auto mt-14 p-10 pt-16 rounded-2xl md:w-2/4">
               <PaymentStatusMessage />
            </div>
         </div>
      </LoginRequiredPage>
   );
}
