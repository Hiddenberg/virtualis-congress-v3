"use client";
import { CreditCard } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/global/Buttons";
import { createRecordingsCheckout } from "../serverActions/recordingsCheckoutActions";

interface BuyRecordingsButtonProps {
   priceId?: string;
   className?: string;
}

export default function BuyRecordingsButton({ priceId, className }: BuyRecordingsButtonProps) {
   const [isLoading, setIsLoading] = useState(false);

   const action = async () => {
      setIsLoading(true);
      try {
         await createRecordingsCheckout();
      } finally {
         setIsLoading(false);
      }
   };

   return (
      <form action={action}>
         <input type="hidden" name="priceId" value={priceId ?? ""} />
         <Button
            variant="blue"
            loading={isLoading}
            className={`w-full ${className ?? ""}`}
            title="Pagar con Stripe"
            type="submit"
         >
            <CreditCard className="w-4 h-4" />
            Comprar acceso a las grabaciones
         </Button>
      </form>
   );
}
