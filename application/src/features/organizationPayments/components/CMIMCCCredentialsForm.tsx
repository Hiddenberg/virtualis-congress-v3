"use client";

import { CheckCircle, Eye, EyeOff, Globe, Key, Loader2, Shield } from "lucide-react";
import { useState, useTransition } from "react";
import toast from "react-hot-toast";
import { IS_DEV_ENVIRONMENT } from "@/data/constants/platformConstants";
import { createOrganizationCredentialsAction } from "../serverActions/organizationCredentialsActions";

export default function CMIMCCCredentialsForm() {
   const [credentialsForm, setCredentialsForm] = useState<NewOrganizationStripeCredentialsData>({
      environment: IS_DEV_ENVIRONMENT ? "development" : "production",
      apiKey: "",
      webhookSecret: "",
   });
   const [isSubmitting, startTransition] = useTransition();
   const [showApiKey, setShowApiKey] = useState(false);
   const [showWebhookSecret, setShowWebhookSecret] = useState(false);

   const handleInputChange = (field: keyof OrganizationStripeCredentials, value: string) => {
      setCredentialsForm((prev) => ({
         ...prev,
         [field]: value,
      }));
   };

   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      startTransition(async () => {
         const response = await createOrganizationCredentialsAction(credentialsForm);

         if (!response.success) {
            toast.error(response.errorMessage);
            return;
         }

         toast.success("Credenciales de organización creadas exitosamente");
         // Reload page to show the credentials
         window.location.reload();
      });
   };

   return (
      <form onSubmit={handleSubmit} className="space-y-6">
         {/* Environment Selection */}
         <div>
            <label className="flex items-center gap-2 mb-3 font-medium text-gray-700 text-sm">
               <Globe className="w-4 h-4" />
               Entorno
            </label>
            <div className="gap-3 grid grid-cols-2">
               <button
                  type="button"
                  onClick={() => handleInputChange("environment", "development")}
                  className={`p-3 border rounded-lg text-sm font-medium transition-colors ${
                     credentialsForm.environment === "development"
                        ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                        : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                  }`}
               >
                  Desarrollo
               </button>
               <button
                  type="button"
                  onClick={() => handleInputChange("environment", "production")}
                  className={`p-3 border rounded-lg text-sm font-medium transition-colors ${
                     credentialsForm.environment === "production"
                        ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                        : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                  }`}
               >
                  Producción
               </button>
            </div>
         </div>

         {/* API Key */}
         <div>
            <label className="flex items-center gap-2 mb-2 font-medium text-gray-700 text-sm">
               <Key className="w-4 h-4" />
               Clave API de Stripe
            </label>
            <div className="relative">
               <input
                  type={showApiKey ? "text" : "password"}
                  value={credentialsForm.apiKey}
                  onChange={(e) => handleInputChange("apiKey", e.target.value)}
                  placeholder={credentialsForm.environment === "development" ? "sk_test_..." : "sk_live_..."}
                  className="px-4 py-3 pr-12 border border-gray-200 focus:border-emerald-500 rounded-lg focus:ring-2 focus:ring-emerald-500 w-full transition-colors"
                  required
               />
               <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="top-1/2 right-3 absolute text-gray-400 hover:text-gray-600 transition-colors -translate-y-1/2 transform"
               >
                  {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
               </button>
            </div>
            <p className="mt-1 text-gray-500 text-xs">
               Encuentra tu clave API en el panel de Stripe → Desarrolladores → Claves API
            </p>
         </div>

         {/* Webhook Secret */}
         <div>
            <label className="flex items-center gap-2 mb-2 font-medium text-gray-700 text-sm">
               <Shield className="w-4 h-4" />
               Webhook Secret
            </label>
            <div className="relative">
               <input
                  type={showWebhookSecret ? "text" : "password"}
                  value={credentialsForm.webhookSecret}
                  onChange={(e) => handleInputChange("webhookSecret", e.target.value)}
                  placeholder="whsec_..."
                  className="px-4 py-3 pr-12 border border-gray-200 focus:border-emerald-500 rounded-lg focus:ring-2 focus:ring-emerald-500 w-full transition-colors"
                  required
               />
               <button
                  type="button"
                  onClick={() => setShowWebhookSecret(!showWebhookSecret)}
                  className="top-1/2 right-3 absolute text-gray-400 hover:text-gray-600 transition-colors -translate-y-1/2 transform"
               >
                  {showWebhookSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
               </button>
            </div>
            <p className="mt-1 text-gray-500 text-xs">Encuentra el webhook secret en Stripe → Desarrolladores → Webhooks</p>
         </div>

         {/* Submit Button */}
         <div className="pt-6 border-t">
            <button
               type="submit"
               disabled={isSubmitting}
               className="flex justify-center items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 px-6 py-3 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 w-full font-medium text-white transition-colors disabled:cursor-not-allowed"
            >
               {isSubmitting ? (
                  <>
                     <Loader2 className="w-4 h-4 animate-spin" />
                     Guardando...
                  </>
               ) : (
                  <>
                     <CheckCircle className="w-4 h-4" />
                     Guardar Credenciales
                  </>
               )}
            </button>
         </div>

         {/* Security Note */}
         <div className="bg-gray-50 p-4 border border-gray-200 rounded-lg">
            <p className="text-gray-600 text-sm">
               <Shield className="inline mr-2 w-4 h-4" />
               <strong>Nota de Seguridad:</strong> Todas las credenciales se almacenan de forma encriptada y segura. Solo los
               super administradores pueden acceder a esta información.
            </p>
         </div>
      </form>
   );
}
