"use client";

import { useState } from "react";
import { NewProductPriceData } from "../../types/congressProductPricesTypes";
import { CongressProductRecord, NewCongressProductData } from "../../types/congressProductsTypes";

export default function ProductPriceForm({ productId }: { productId: CongressProductRecord["id"] }) {
   const [priceFormData, setPriceFormData] = useState<NewProductPriceData>({
      name: "",
      currency: "mxn",
      priceAmount: 0,
      requiresCredentialValidation: false,
      product: productId,
   });

   const [errors, setErrors] = useState<Partial<Record<keyof NewProductPriceData, string>>>({});

   const validateForm = () => {};

   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setPriceFormData({ ...priceFormData, [name]: value });
   };

   return <form action=""></form>;
}
