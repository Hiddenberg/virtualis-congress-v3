import { LinkButton } from "@/components/global/Buttons";
import ConferenceCarousel from "@/components/registration/ConferenceCarousel";
import ConferenceInfoSection from "@/components/registration/ConferenceInfoSection";
import NewPricingSection from "@/components/registration/NewPricingSection";
import RegistrationHeroSection from "@/components/registration/RegistrationHerosection";

export default function RegistrationHomepage() {
   return (
      <div className="relative flex flex-col space-y-5 bg-white">
         <RegistrationHeroSection />
         <NewPricingSection />
         <ConferenceInfoSection />
         <div className="px-4 md:px-10">
            {/* <ExpositorsCarouselSection /> */}
            <div>
               <ConferenceCarousel />
               {/* <SponsorsSection /> */}
               <div className="flex flex-col justify-center space-y-10 pb-20">
                  <h1 className="pt-20 font-semibold text-blue-900 text-xl md:text-2xl text-center">
                     No te pierdas la oportunidad de actualizar tus conocimientos y conectar con profesionales de talla
                     internacional.
                  </h1>

                  <LinkButton className="mx-auto md:!px-24 text-xl" href="/registro/formulario">
                     Regístrate ahora
                  </LinkButton>
               </div>
            </div>
         </div>
      </div>
   );
}
