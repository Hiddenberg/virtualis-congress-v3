import { AlertTriangle, CheckCircle, CreditCard, Globe, Key, Shield } from "lucide-react";
import { redirect } from "next/navigation";
import CMIMCCCredentialsForm from "@/features/organizationPayments/components/CMIMCCCredentialsForm";
import DeleteOrganizationCredentialsButton from "@/features/organizationPayments/components/DeleteOrganizationCredentialsButton";
import { getBlurredOrganizationStripeCredentials } from "@/features/organizationPayments/services/organizationStripeCredentialsServices";
import { getLoggedInUserId } from "@/features/staggeredAuth/services/staggeredAuthServices";
import { getUserById } from "@/features/users/services/userServices";

export default async function StripeCredentialsAdminPage() {
   const userId = await getLoggedInUserId();
   const user = await getUserById(userId ?? "");
   if (!user || user.role !== "super_admin") {
      return redirect("../");
   }
   const credentialsSaved = await getBlurredOrganizationStripeCredentials();

   return (
      <div className="mx-auto p-6 max-w-4xl">
         {/* Header */}
         <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
               <div className="flex justify-center items-center bg-emerald-50 rounded-lg w-12 h-12">
                  <CreditCard className="w-6 h-6 text-emerald-600" />
               </div>
               <div>
                  <h1 className="font-bold text-gray-900 text-3xl">Credenciales de Stripe</h1>
                  <p className="mt-1 text-gray-600">Configura y administra las credenciales de pago de tu organización</p>
               </div>
            </div>

            {/* Security Warning */}
            <div className="flex items-start gap-3 bg-amber-50 p-4 border border-amber-200 rounded-lg">
               <AlertTriangle className="mt-0.5 w-5 h-5 text-amber-600 shrink-0" />
               <div>
                  <h3 className="mb-1 font-semibold text-amber-800">Información Sensible</h3>
                  <p className="text-amber-700 text-sm">
                     Las credenciales de Stripe son información altamente sensible. Mantén estas credenciales seguras y no las
                     compartas con personas no autorizadas.
                  </p>
               </div>
            </div>
         </div>

         {credentialsSaved ? (
            <div className="space-y-6">
               {/* Current Credentials Status */}
               <div className="bg-white p-6 border border-gray-200 rounded-xl">
                  <div className="flex justify-between items-center mb-6">
                     <h2 className="flex items-center gap-2 font-semibold text-gray-900 text-xl">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        Credenciales Configuradas
                     </h2>
                     <div className="flex items-center gap-2 bg-green-50 px-3 py-1 rounded-full font-medium text-green-700 text-sm">
                        <div className="bg-green-500 rounded-full w-2 h-2" />
                        {credentialsSaved.environment}
                     </div>
                  </div>

                  <div className="gap-4 grid md:grid-cols-2">
                     <div>
                        <div className="flex items-center gap-2 mb-2 font-medium text-gray-700 text-sm">
                           <Key className="w-4 h-4" />
                           Clave API
                        </div>
                        <div className="bg-gray-50 p-3 border border-gray-200 rounded-lg">
                           <code className="font-mono text-gray-600 text-sm">{credentialsSaved.apiKey}</code>
                        </div>
                     </div>

                     <div className="space-y-4">
                        <div>
                           <div className="flex items-center gap-2 mb-2 font-medium text-gray-700 text-sm">
                              <Globe className="w-4 h-4" />
                              Estado del Entorno
                           </div>
                           <div className="flex items-center gap-2">
                              <div className="bg-blue-50 px-3 py-1 rounded-full font-medium text-blue-700 text-sm">
                                 Configurado
                              </div>
                           </div>
                        </div>

                        <div className="pt-4">
                           <h4 className="mb-2 font-medium text-gray-900">URLs Configuradas</h4>
                           <div className="space-y-1 text-gray-600 text-sm">
                              <div>✓ URL de éxito configurada</div>
                              <div>✓ URL de cancelación configurada</div>
                              <div>✓ URL de retorno configurada</div>
                           </div>
                        </div>
                     </div>
                  </div>

                  <div className="mt-6 pt-6 border-gray-200 border-t">
                     <DeleteOrganizationCredentialsButton credentialsId={credentialsSaved.id} />
                  </div>
               </div>

               {/* Usage Guidelines */}
               <div className="bg-blue-50 p-6 border border-blue-200 rounded-xl">
                  <h3 className="flex items-center gap-2 mb-3 font-semibold text-blue-900">
                     <Shield className="w-5 h-5" />
                     Guías de Seguridad
                  </h3>
                  <ul className="space-y-2 text-blue-800 text-sm">
                     <li className="flex items-start gap-2">
                        <div className="bg-blue-600 mt-2 rounded-full w-1.5 h-1.5 shrink-0" />
                        Las credenciales están encriptadas y almacenadas de forma segura
                     </li>
                     <li className="flex items-start gap-2">
                        <div className="bg-blue-600 mt-2 rounded-full w-1.5 h-1.5 shrink-0" />
                        Solo los super administradores pueden ver y modificar estas credenciales
                     </li>
                     <li className="flex items-start gap-2">
                        <div className="bg-blue-600 mt-2 rounded-full w-1.5 h-1.5 shrink-0" />
                        Los valores mostrados están parcialmente ocultos por seguridad
                     </li>
                  </ul>
               </div>
            </div>
         ) : (
            <div className="space-y-6">
               {/* Setup Instructions */}
               <div className="bg-white p-6 border border-gray-200 rounded-xl">
                  <div className="mb-6 text-center">
                     <div className="flex justify-center items-center bg-emerald-50 mx-auto mb-4 rounded-full w-16 h-16">
                        <CreditCard className="w-8 h-8 text-emerald-600" />
                     </div>
                     <h2 className="mb-2 font-semibold text-gray-900 text-xl">Configurar Credenciales de Stripe</h2>
                     <p className="text-gray-600">
                        Configura las credenciales de Stripe para habilitar los pagos en tu plataforma
                     </p>
                  </div>

                  {/* Instructions */}
                  <div className="bg-gray-50 mb-6 p-4 border border-gray-200 rounded-lg">
                     <h3 className="mb-3 font-semibold text-gray-900">Antes de comenzar:</h3>
                     <ol className="space-y-2 text-gray-700 text-sm">
                        <li className="flex items-start gap-2">
                           <span className="flex justify-center items-center bg-emerald-100 rounded-full w-5 h-5 font-semibold text-emerald-700 text-xs shrink-0">
                              1
                           </span>
                           Crea una cuenta en{" "}
                           <a
                              href="https://stripe.com"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-emerald-600 hover:underline"
                           >
                              Stripe.com
                           </a>
                        </li>
                        <li className="flex items-start gap-2">
                           <span className="flex justify-center items-center bg-emerald-100 rounded-full w-5 h-5 font-semibold text-emerald-700 text-xs shrink-0">
                              2
                           </span>
                           Obtén tu clave API desde el panel de Stripe
                        </li>
                     </ol>
                  </div>

                  <CMIMCCCredentialsForm />
               </div>
            </div>
         )}
      </div>
   );
}
