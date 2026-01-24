"use client";

import { useState, useTransition } from "react";
import toast from "react-hot-toast";
import { obtainPriceStripeCheckoutUrlAction } from "@/features/congresses/serverActions/congressProductsActions";
import type { ProductPriceRecord } from "@/features/congresses/types/congressProductPricesTypes";

export default function PricePaymentForm({ price }: { price: ProductPriceRecord }) {
   const [isLoading, startTransition] = useTransition();
   const [paymentFormData, setPaymentFormData] = useState<{
      credentialFile?: File;
      includeRecordings: boolean;
   }>({
      includeRecordings: false,
   });

   const handlePay = () => {
      startTransition(async () => {
         const response = await obtainPriceStripeCheckoutUrlAction({
            priceId: price.id,
            includeRecordings: true,
         });

         if (!response.success) {
            toast.error(response.errorMessage);
            return;
         }

         const checkoutLink = response.data;
         // Redirect to the checkout link
         window.location.href = checkoutLink;
      });
   };

   return <div>PricePaymentForm</div>;
}
