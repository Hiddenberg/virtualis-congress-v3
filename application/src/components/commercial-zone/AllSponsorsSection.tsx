import PharmaCardsBig from "./PharmaCardsBig";
import PharmaCardsMedium from "./PharmaCardsMedium";
import PharmaCardsSmall from "./PharmaCardsSmall";

function AllSponsorsSection() {
   return (
      <div className="flex flex-col">
         <PharmaCardsBig />
         <PharmaCardsMedium />
         <PharmaCardsSmall />
      </div>
   );
}

export default AllSponsorsSection;
