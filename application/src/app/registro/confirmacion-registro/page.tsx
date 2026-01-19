import LoginRequiredPage from "@/components/global/redirectors/LoginRequiredPage";
import HeaderBlack from "@/components/registration/HeaderBlack";
import HomePayment from "@/components/registration/payment-page/HomePayment";
import PaymentButtons from "@/components/registration/payment-page/PaymentButtons";

export default function PaymentPage() {
   return (
      <LoginRequiredPage>
         <div className="space-y-10 bg-white p-4 md:px-10 h-screen">
            <HeaderBlack />
            <div className="flex flex-col justify-center items-center">
               <HomePayment />
            </div>
            <PaymentButtons />
         </div>
      </LoginRequiredPage>
   );
}
