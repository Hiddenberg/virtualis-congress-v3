"use client";

import { useState } from "react";
import { getACPMemberDataAction } from "@/actions/acpActions";
import { useDynamicFormContext } from "@/contexts/DynamicFormContext";
import { useCountryCode } from "@/customHooks/useCountryCode";
import InvalidACPIDPopUp from "./form/InvalidACPIDPopUp";

export default function ACPIDCheckButton() {
   const { countryCode, isPending } = useCountryCode();
   const [loading, setLoading] = useState(false);
   const [showInvalidACPIDPopUp, setShowInvalidACPIDPopUp] = useState(false);
   const [isBlackListed, setIsBlackListed] = useState(false);

   const { getInputValue, skipCmimSection, updateInputValue } =
      useDynamicFormContext();

   if (isPending || countryCode === null || countryCode !== "MX") {
      return null;
   }

   const acpID = getInputValue("acpID") as string | null;

   const handleCheckACPID = async () => {
      setLoading(true);
      const acpID = getInputValue("acpID") as string;
      const acpData = await getACPMemberDataAction(acpID);
      setLoading(false);

      console.log("[ACPIDCheckButton] ACP member data response:", acpData);
      if (!acpData) {
         setShowInvalidACPIDPopUp(true);
         return;
      }

      if (acpData.isBlackListed === true) {
         setShowInvalidACPIDPopUp(true);
         setIsBlackListed(true);
         console.log(
            "[ACPIDCheckButton] Blacklisted ACP ID condition:",
            acpID && (showInvalidACPIDPopUp || isBlackListed),
         );
         return;
      }

      updateInputValue("name", acpData.fullName as never);
      updateInputValue("age", acpData.age as never);
      updateInputValue("city", acpData.city as never);
      updateInputValue("country", "México" as never);

      updateInputValue("isCMIMAffiliated", false as never);
      skipCmimSection();
   };

   return (
      <>
         <button
            onClick={handleCheckACPID}
            disabled={!acpID || loading}
            className="bg-yellow-400 disabled:bg-gray-400 mt-4 p-2 rounded-xl text-black transition-colors"
         >
            {loading ? "Comprobando..." : "Comprobar ACP ID"}
         </button>
         {acpID && showInvalidACPIDPopUp && (
            <InvalidACPIDPopUp
               acpId={acpID}
               setShowPopUp={setShowInvalidACPIDPopUp}
               isBlackListed={isBlackListed}
            />
         )}
      </>
   );
}
