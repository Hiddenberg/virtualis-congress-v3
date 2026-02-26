"use client";

import { CheckCircle, FileText, Percent, PlayCircle, ShieldCheck, Tag, Upload, X } from "lucide-react";
import { useRef, useState, useTransition } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/global/Buttons";
import { obtainPriceStripeCheckoutUrlAction } from "@/features/congresses/serverActions/congressProductsActions";
import type { ProductPriceRecord } from "@/features/congresses/types/congressProductPricesTypes";
import { formatPrice } from "@/features/landingPages/components/organizationLandingPages/GenericCongressLanding/genericPricesSection/utils";
import RecordingsIncludedBanner from "./RecordingsIncludedBanner";

interface PricePaymentFormProps {
   price: ProductPriceRecord;
   recordingsPrice?: ProductPriceRecord;
}

export default function PricePaymentForm({ price, recordingsPrice }: PricePaymentFormProps) {
   const [isLoading, startTransition] = useTransition();
   const [credentialFile, setCredentialFile] = useState<File | null>(null);
   const [includeRecordings, setIncludeRecordings] = useState(false);
   const [promoCode, setPromoCode] = useState("");
   const [dragActive, setDragActive] = useState(false);
   const fileInputRef = useRef<HTMLInputElement>(null);

   const acceptedFileTypes = "image/jpeg,image/png,image/jpg,application/pdf";
   const maxSizeMB = 10;

   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
         validateAndSetFile(file);
      }
   };

   const validateAndSetFile = (file: File) => {
      // Check file type
      if (!acceptedFileTypes.includes(file.type)) {
         toast.error("Tipo de archivo no válido. Por favor, seleccione un archivo JPG, PNG o PDF.");
         return;
      }

      // Check file size
      if (file.size > maxSizeMB * 1024 * 1024) {
         toast.error(`El archivo es demasiado grande. El tamaño máximo es ${maxSizeMB}MB.`);
         return;
      }

      setCredentialFile(file);
      toast.success("Archivo seleccionado correctamente");
   };

   const handleDrop = (event: React.DragEvent) => {
      event.preventDefault();
      setDragActive(false);
      const file = event.dataTransfer.files?.[0];
      if (file) {
         validateAndSetFile(file);
      }
   };

   const handleDragOver = (event: React.DragEvent) => {
      event.preventDefault();
      setDragActive(true);
   };

   const handleDragLeave = () => {
      setDragActive(false);
   };

   const removeFile = () => {
      setCredentialFile(null);
      if (fileInputRef.current) {
         fileInputRef.current.value = "";
      }
   };

   const handlePay = () => {
      if (price.requiresCredentialValidation && !credentialFile) {
         toast.error("Por favor, sube el documento de validación de credenciales para continuar");
         return;
      }

      startTransition(async () => {
         toast.loading("Procesando pago...");

         const response = await obtainPriceStripeCheckoutUrlAction({
            priceId: price.id,
            credentialFile: credentialFile || undefined,
            includeRecordings: includeRecordings,
            promoCode: promoCode.trim() || undefined,
         });

         toast.dismiss();

         if (!response.success) {
            toast.error(response.errorMessage);
            return;
         }

         const checkoutLink = response.data;
         window.location.href = checkoutLink;
      });
   };

   const canProceed = !price.requiresCredentialValidation || credentialFile !== null;

   const baseAmount = includeRecordings && recordingsPrice ? price.priceAmount + recordingsPrice.priceAmount : price.priceAmount;
   const totalAmount = baseAmount;

   return (
      <div className="space-y-6 sm:space-y-8 mx-auto max-w-3xl">
         {/* Recordings Included Banner */}
         {price.includesRecordings && <RecordingsIncludedBanner />}

         {/* Promo Code / Invitation Code Section */}
         <div className="bg-white shadow-md backdrop-blur-sm p-6 sm:p-8 border-2 border-gray-200/50 rounded-xl sm:rounded-2xl">
            <div className="flex items-center gap-3 mb-4">
               <div className="flex justify-center items-center bg-emerald-100 rounded-full w-10 sm:w-12 h-10 sm:h-12 shrink-0">
                  <Tag className="w-5 sm:w-6 h-5 sm:h-6 text-emerald-600" />
               </div>
               <div>
                  <h2 className="font-bold text-gray-900 text-lg sm:text-xl">Código de invitación o descuento</h2>
                  <p className="text-gray-500 text-sm">
                     Si tienes un código de cortesía o descuento, introdúcelo aquí. Se aplicará al continuar al pago.
                  </p>
               </div>
            </div>
            <div className="flex gap-2">
               <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  placeholder="Ej: INVITACION2024"
                  className="flex-1 px-4 py-3 border border-gray-300 focus:border-emerald-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-sm uppercase"
               />
               {promoCode.trim() ? (
                  <button
                     type="button"
                     onClick={() => setPromoCode("")}
                     className="hover:bg-gray-100 px-4 py-3 rounded-lg text-gray-500 hover:text-gray-700 transition-colors"
                     aria-label="Quitar código"
                  >
                     <X className="w-5 h-5" />
                  </button>
               ) : null}
            </div>
            {promoCode.trim() && (
               <p className="flex items-center gap-1 mt-2 text-emerald-600 text-sm">
                  <Percent className="w-4 h-4" />
                  El descuento se aplicará al continuar al pago
               </p>
            )}
         </div>

         {/* Recordings Add-on Section */}
         {recordingsPrice && !price.includesRecordings && (
            <div
               className={`bg-white shadow-md p-6 sm:p-8 border-2 rounded-xl sm:rounded-2xl transition-all duration-300 ${
                  includeRecordings
                     ? "border-purple-300 bg-purple-50 shadow-purple-100"
                     : "border-gray-200 hover:border-purple-200 hover:shadow-lg"
               }`}
            >
               <div className="flex items-start gap-4">
                  <div
                     className={`flex justify-center items-center rounded-full w-12 h-12 sm:w-14 sm:h-14 shrink-0 transition-colors ${
                        includeRecordings ? "bg-purple-100" : "bg-gray-100"
                     }`}
                  >
                     <PlayCircle
                        className={`w-6 h-6 sm:w-7 sm:h-7 transition-colors ${
                           includeRecordings ? "text-purple-600" : "text-gray-500"
                        }`}
                     />
                  </div>
                  <div className="flex-1 min-w-0">
                     <div className="flex items-center gap-2 mb-2">
                        <h2 className="font-bold text-gray-900 text-lg sm:text-xl">Agregar acceso a Grabaciones</h2>
                        <span className="bg-purple-100 px-2 py-0.5 rounded font-medium text-purple-700 text-xs">Adicional</span>
                     </div>
                     <p className="mb-4 text-gray-600 text-sm sm:text-base">
                        Obtén acceso a todas las grabaciones del congreso una vez finalizado el evento. Podrás ver las ponencias
                        cuando quieras, a tu ritmo.
                     </p>
                     <div className="flex sm:flex-row flex-col justify-between items-start sm:items-center gap-4">
                        <div>
                           <div className="mb-1 font-bold text-gray-900 text-xl sm:text-2xl">
                              {formatPrice(recordingsPrice.priceAmount, recordingsPrice.currency)}
                           </div>
                           <p className="text-gray-500 text-xs sm:text-sm">Disponible después del evento</p>
                        </div>
                        <label className="inline-flex relative items-center cursor-pointer">
                           <input
                              type="checkbox"
                              checked={includeRecordings}
                              onChange={(e) => setIncludeRecordings(e.target.checked)}
                              className="sr-only peer"
                           />
                           <div className="peer after:top-[2px] after:left-[2px] after:absolute bg-gray-200 after:bg-white peer-checked:bg-purple-600 after:border after:border-gray-300 peer-checked:after:border-white rounded-full after:rounded-full peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 w-14 after:w-6 h-7 after:h-6 after:content-[''] after:transition-all peer-checked:after:translate-x-full"></div>
                           <span className="ml-3 font-semibold text-gray-700 text-sm sm:text-base">
                              {includeRecordings ? "Incluido" : "Agregar"}
                           </span>
                        </label>
                     </div>
                  </div>
               </div>
            </div>
         )}

         {/* Price Summary Card */}
         <div className="bg-white shadow-md backdrop-blur-sm p-6 sm:p-8 border-2 border-gray-200/50 rounded-xl sm:rounded-2xl">
            <div className="flex items-center gap-3 mb-6">
               <div className="flex justify-center items-center bg-linear-to-br from-gray-500 to-gray-600 shadow-lg rounded-full w-10 sm:w-12 h-10 sm:h-12">
                  <CheckCircle className="w-5 sm:w-6 h-5 sm:h-6 text-white" />
               </div>
               <h2 className="font-bold text-gray-900 text-xl sm:text-2xl">Resumen del pago</h2>
            </div>
            <div className="space-y-4">
               <div className="flex justify-between items-center pb-4 border-gray-200 border-b">
                  <span className="text-gray-700 text-base sm:text-lg">{price.name}</span>
                  <span className="font-bold text-gray-900 text-lg sm:text-xl">
                     {formatPrice(price.priceAmount, price.currency)}
                  </span>
               </div>
               {includeRecordings && recordingsPrice && (
                  <div className="flex justify-between items-center pb-4 border-gray-200 border-b">
                     <span className="text-gray-700 text-base sm:text-lg">Acceso a Grabaciones</span>
                     <span className="font-bold text-gray-900 text-lg sm:text-xl">
                        {formatPrice(recordingsPrice.priceAmount, recordingsPrice.currency)}
                     </span>
                  </div>
               )}
               <div className="flex justify-between items-center pt-2">
                  <span className="font-semibold text-gray-900 text-base sm:text-lg">Total</span>
                  <span className="font-bold text-gray-900 text-xl sm:text-2xl">{formatPrice(totalAmount, price.currency)}</span>
               </div>
            </div>
         </div>

         {/* Credential Validation Section */}
         {price.requiresCredentialValidation && (
            <div className="bg-white shadow-md backdrop-blur-sm p-6 sm:p-8 border-2 border-amber-200/50 rounded-xl sm:rounded-2xl">
               <div className="flex items-start gap-3 mb-6">
                  <div className="flex justify-center items-center bg-amber-100 shadow-amber-200/50 shadow-lg rounded-full w-10 sm:w-12 h-10 sm:h-12 shrink-0">
                     <ShieldCheck className="w-5 sm:w-6 h-5 sm:h-6 text-amber-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                     <h2 className="mb-2 font-bold text-gray-900 text-lg sm:text-xl">Validación de credenciales requerida</h2>
                     {price.credentialValidationInstructions && (
                        <p className="text-gray-700 text-sm sm:text-base">{price.credentialValidationInstructions}</p>
                     )}
                  </div>
               </div>

               {/* File Upload Area */}
               <label
                  htmlFor="credential-file-upload"
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  className={`relative block border-2 border-dashed rounded-lg sm:rounded-xl p-6 sm:p-8 text-center transition-all duration-300 cursor-pointer ${
                     dragActive
                        ? "border-blue-500 bg-blue-50"
                        : credentialFile
                          ? "border-green-500 bg-green-50"
                          : "border-gray-300 bg-gray-50 hover:border-gray-400"
                  }`}
               >
                  <input
                     id="credential-file-upload"
                     ref={fileInputRef}
                     type="file"
                     accept={acceptedFileTypes}
                     onChange={handleFileChange}
                     className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                  />

                  {credentialFile ? (
                     <div className="space-y-4">
                        <div className="flex justify-center items-center bg-green-100 mx-auto rounded-full w-14 sm:w-16 h-14 sm:h-16">
                           <FileText className="w-7 sm:w-8 h-7 sm:h-8 text-green-600" />
                        </div>
                        <div>
                           <p className="font-semibold text-green-800 text-sm sm:text-base wrap-break-word">
                              {credentialFile.name}
                           </p>
                           <p className="text-green-600 text-xs sm:text-sm">
                              {(credentialFile.size / 1024 / 1024).toFixed(2)} MB
                           </p>
                        </div>
                        <button
                           type="button"
                           onClick={(e) => {
                              e.stopPropagation();
                              removeFile();
                           }}
                           className="text-red-600 hover:text-red-800 text-sm sm:text-base underline"
                        >
                           Remover archivo
                        </button>
                     </div>
                  ) : (
                     <div className="space-y-4">
                        <div className="flex justify-center items-center bg-gray-200 mx-auto rounded-full w-14 sm:w-16 h-14 sm:h-16">
                           <Upload className="w-7 sm:w-8 h-7 sm:h-8 text-gray-500" />
                        </div>
                        <div>
                           <p className="mb-2 px-2 font-semibold text-gray-700 text-base sm:text-lg">
                              Arrastra tu archivo aquí o haz clic para seleccionar
                           </p>
                           <p className="px-2 text-gray-500 text-xs sm:text-sm">
                              Formatos aceptados: PDF, JPG, PNG (máx. {maxSizeMB}MB)
                           </p>
                        </div>
                     </div>
                  )}
               </label>

               {!credentialFile && (
                  <p className="mt-4 text-amber-600 text-sm text-center">
                     Debes subir un documento para validar tus credenciales antes de continuar
                  </p>
               )}
            </div>
         )}

         {/* Payment Button */}
         <div className="flex justify-center pt-4">
            <Button
               variant="primary"
               onClick={handlePay}
               disabled={!canProceed || isLoading}
               loading={isLoading}
               className="shadow-lg hover:shadow-xl px-10 py-4 w-full sm:w-auto min-w-[240px] text-base sm:text-lg transition-all duration-300"
            >
               {isLoading ? "Procesando..." : "Continuar al pago"}
            </Button>
         </div>
      </div>
   );
}
