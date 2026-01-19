import { RedirectIfLoggedIn } from "@/components/global/redirectors/RedirectIfLogggedIn";
import DesktopOnlyDetails from "@/components/registration/form/DesktopOnlyDetails";
import RegistrationForm from "@/components/registration/RegistrationForm";
import { DynamicFormContextProvider } from "@/contexts/DynamicFormContext";

export default function FormPage() {
   return (
      <RedirectIfLoggedIn to="/registro/confirmacion-registro">
         <div className="md:grid md:grid-cols-2 h-screen">
            <DesktopOnlyDetails />

            <DynamicFormContextProvider>
               <RegistrationForm />
            </DynamicFormContextProvider>
         </div>
      </RedirectIfLoggedIn>
   );
}
