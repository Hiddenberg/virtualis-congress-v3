import AbbottPartnerPageContent from "@/components/partners-demo/commercial-zone/partner/abbott/AbbottPartnerPageContent";
import TopBrandsNav from "@/components/partners-demo/commercial-zone/TopBrandsNav";

export default function AbbottCommercialZonePage() {
   return (
      <div className="flex flex-col gap-4">
         <TopBrandsNav active="Abbott" />
         <AbbottPartnerPageContent />
      </div>
   );
}
