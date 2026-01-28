import { useId } from "react";

interface PaymentAmountFieldsProps {
   amount: string;
   setAmount: (value: string) => void;
   discount: string;
   setDiscount: (value: string) => void;
   currency: string;
   setCurrency: (value: string) => void;
}

export function PaymentAmountFields({
   amount,
   setAmount,
   discount,
   setDiscount,
   currency,
   setCurrency,
}: PaymentAmountFieldsProps) {
   const amountId = useId();
   const discountId = useId();
   const currencyId = useId();

   return (
      <>
         <div className="gap-4 grid grid-cols-1 sm:grid-cols-3">
            <div className="sm:col-span-2">
               <label htmlFor={amountId} className="block mb-2 font-medium text-gray-700 text-sm">
                  Monto Total
               </label>
               <input
                  id={amountId}
                  inputMode="decimal"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="px-4 py-3 border border-gray-300 focus:border-blue-500 rounded-lg focus:ring-2 focus:ring-blue-500 w-full transition-colors"
                  placeholder="0.00"
               />
            </div>
            <div>
               <label htmlFor={discountId} className="block mb-2 font-medium text-gray-700 text-sm">
                  Descuento
               </label>
               <input
                  id={discountId}
                  inputMode="decimal"
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                  className="px-4 py-3 border border-gray-300 focus:border-blue-500 rounded-lg focus:ring-2 focus:ring-blue-500 w-full transition-colors"
                  placeholder="0.00"
               />
            </div>
         </div>

         <div>
            <label htmlFor={currencyId} className="block mb-2 font-medium text-gray-700 text-sm">
               Moneda
            </label>
            <select
               id={currencyId}
               value={currency}
               onChange={(e) => setCurrency(e.target.value)}
               className="px-4 py-3 border border-gray-300 focus:border-blue-500 rounded-lg focus:ring-2 focus:ring-blue-500 w-full transition-colors"
            >
               <option value="mxn">Pesos Mexicanos (MXN)</option>
               <option value="usd">Dólares Americanos (USD)</option>
            </select>
         </div>
      </>
   );
}
