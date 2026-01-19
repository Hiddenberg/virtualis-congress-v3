import SanferPartnerPageContent from "@/components/partners-demo/commercial-zone/partner/sanfer/SanferPartnerPageContent";
import TopBrandsNav from "@/components/partners-demo/commercial-zone/TopBrandsNav";

export default function SanferCommercialZonePage() {
   return (
      <div className="flex flex-col gap-4">
         <TopBrandsNav active="Sanfer" />
         <SanferPartnerPageContent />
      </div>
   );
}
