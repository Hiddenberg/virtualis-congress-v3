import { Camera } from "lucide-react";
import PopUp from "@/components/global/PopUp";

export default function BillingInfoPopUp({ setShowPopUp }: { setShowPopUp: React.Dispatch<React.SetStateAction<boolean>> }) {
   return (
      <PopUp onClose={() => setShowPopUp(false)}>
         <div className="flex flex-col justify-center items-center gap-2 mb-2 text-yellow-400">
            <Camera className="size-6 text-yellow-400" />
            <span className="font-semibold">Te recomendamos tomar una captura</span>
         </div>
         <h2 className="mb-4 font-bold text-xl">Información para Solicitar Factura</h2>
         <div className="space-y-4">
            <p>Para solicitar su factura, por favor siga estos pasos:</p>
            <ol className="space-y-2 list-decimal list-inside">
               <li>
                  Envíe un correo electrónico a: <strong>facturacion.acpmexico25@gmail.com</strong>
               </li>
               <li>En el asunto del correo, escriba: &#34;Solicitud de Factura - [Su Nombre]&#34;</li>
               <li>
                  En el cuerpo del correo, incluya la siguiente información:
                  <ul className="space-y-1 mt-2 ml-4 list-disc list-inside">
                     <li>Razón Social</li>
                     <li>RFC</li>
                     <li>Dirección fiscal completa</li>
                     <li>Método de pago</li>
                     <li>Forma de pago</li>
                     <li>Uso del CFDI</li>
                     <li>Régimen fiscal</li>
                  </ul>
               </li>
               <li>Adjunte una copia de su comprobante de pago (Lo recibirá por correo electrónico)</li>
            </ol>
            <p>
               Una vez recibida su solicitud con toda la información requerida, procesaremos su factura y se la enviaremos por
               correo electrónico en un plazo de 3 a 5 días hábiles.
            </p>
         </div>
      </PopUp>
   );
}
