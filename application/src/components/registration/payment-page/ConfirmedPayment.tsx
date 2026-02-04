"use client";

import { AlertTriangle, ArrowUpRight, Check, FileText, HelpCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import type React from "react";
import { useState } from "react";
import { Button, type ButtonVariant, LinkButton } from "@/components/global/Buttons";
import BillingInfoPopUp from "./BillingInfoPopUp";

type PaymentStatus = "success" | "cancel" | "unknown";
interface StatusConfig {
   icon: React.ReactNode;
   iconBackground: string;
   title: string;
   titleColor: string;
   message: string;
   buttonText: string;
   buttonHref: string;
   buttonVariant: ButtonVariant;
   paymentStatus: PaymentStatus;
}

const STATUS_CONFIGS: Record<PaymentStatus, StatusConfig> = {
   success: {
      icon: <Check className="w-12 h-12 text-white" strokeWidth={3} />,
      iconBackground: "bg-green-500",
      title: "¡Pago Confirmado!",
      titleColor: "text-green-700",
      message:
         "Ya completaste todos los pasos de registro. Ahora puedes acceder al dashboard del congreso para explorar todas las actividades y recursos disponibles.",
      buttonText: "Entrar al congreso",
      buttonHref: "/lobby",
      buttonVariant: "primary",
      paymentStatus: "success",
   },
   cancel: {
      icon: <AlertTriangle className="w-12 h-12 text-white" strokeWidth={3} />,
      iconBackground: "bg-amber-500",
      title: "Pago Cancelado",
      titleColor: "text-amber-700",
      message:
         "Entendemos que a veces surgen imprevistos. Si deseas intentar nuevamente o necesitas ayuda, estamos aquí para asistirte.",
      buttonText: "Reintentar Pago",
      buttonHref: "/api/create-checkout-session",
      buttonVariant: "primary",
      paymentStatus: "cancel",
   },
   unknown: {
      icon: <HelpCircle className="w-12 h-12 text-white" strokeWidth={3} />,
      iconBackground: "bg-blue-500",
      title: "Estado Pendiente",
      titleColor: "text-blue-700",
      message: "No pudimos verificar tu pago, por favor intenta nuevamente o contacta a nuestro equipo de soporte.",
      buttonText: "Reintentar Pago",
      buttonHref: "/api/create-checkout-session",
      buttonVariant: "primary",
      paymentStatus: "unknown",
   },
};

const PaymentStatusMessage: React.FC = () => {
   const searchParams = useSearchParams();
   const status = searchParams ? (searchParams.get("status") as PaymentStatus) : "unknown";
   const config = STATUS_CONFIGS[status in STATUS_CONFIGS ? status : "unknown"];

   return (
      <div className="space-y-8 mx-auto p-6 max-w-md">
         <StatusContent config={config} />
         <ActionButtons config={config} />
         <MobileWarning />
      </div>
   );
};

const StatusContent: React.FC<{ config: StatusConfig }> = ({ config }) => (
   <div className="space-y-6 text-center">
      <div className={`${config.iconBackground} mx-auto rounded-full w-24 h-24 flex items-center justify-center shadow-lg`}>
         {config.icon}
      </div>
      <div className="space-y-4">
         <h1 className={`text-3xl font-bold ${config.titleColor}`}>{config.title}</h1>
         <p className="text-gray-600 leading-relaxed">{config.message}</p>
      </div>
   </div>
);

const ActionButtons: React.FC<{ config: StatusConfig }> = ({ config }) => {
   const [showPopUp, setShowPopUp] = useState(false);

   return (
      <div className="space-y-4">
         <LinkButton href={config.buttonHref} variant={config.buttonVariant} className="mx-auto w-3/4">
            {config.buttonText}
            <ArrowUpRight className="ml-2 w-5 h-5" />
         </LinkButton>

         {config.paymentStatus === "success" && (
            <Button variant="secondary" className="mx-auto w-3/4" onClick={() => setShowPopUp(true)}>
               Solicitar Factura
               <FileText className="ml-2 size-5" />
            </Button>
         )}

         {/* {config.paymentStatus !== "success" && (
            <LinkButton
               href="https://wa.me/5619920940?text=Hola, necesito ayuda con el pago de mi congreso"
               target="_blank"
               variant="primary"
               className="bg-blue-400! hover:bg-blue-500! mx-auto w-3/4 text-white">
               Contactar Soporte
               <LifeBuoy className="ml-2 size-5" />
            </LinkButton>
         )} */}

         {showPopUp && <BillingInfoPopUp setShowPopUp={setShowPopUp} />}
      </div>
   );
};

const MobileWarning: React.FC = () => (
   <div className="md:hidden bg-blue-100 p-4 rounded-lg text-blue-800 text-sm text-center">
      <p>
         <strong>Nota:</strong> La plataforma completa está optimizada para escritorio. Para una mejor experiencia, accede desde
         una computadora.
      </p>
   </div>
);

export default PaymentStatusMessage;
