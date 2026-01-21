"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import toast from "react-hot-toast";
import { createCongressProductPriceAction } from "../../serverActions/congressProductPricesActions";
import { NewProductPriceData } from "../../types/congressProductPricesTypes";
import { CongressProductRecord, NewCongressProductData } from "../../types/congressProductsTypes";

export default function ProductPriceForm({ productId }: { productId: CongressProductRecord["id"] }) {
   const [isPending, startTransition] = useTransition();
   const [priceFormData, setPriceFormData] = useState<NewProductPriceData>({
      name: "",
      currency: "mxn",
      priceAmount: 0,
      requiresCredentialValidation: false,
      product: productId,
   });
   const router = useRouter();

   const [errors, setErrors] = useState<Partial<Record<keyof NewProductPriceData, string>>>({});

   const validateForm = () => {};

   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setPriceFormData({ ...priceFormData, [name]: value });
   };

   const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      startTransition(async () => {
         const response = await createCongressProductPriceAction(priceFormData);
         if (!response.success) {
            toast.error(response.errorMessage);
            return;
         }
         toast.success("Precio del producto creado correctamente");
         router.push(`/congress-admin/products/${productId}/prices`);
      });
   };

   return <form action=""></form>;
}
