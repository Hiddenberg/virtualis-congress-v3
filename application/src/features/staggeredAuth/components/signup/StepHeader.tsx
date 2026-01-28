interface StepHeaderProps {
   currentStep: number;
   welcomeMessage?: string;
   welcomeDescription?: string;
}

export default function StepHeader({ currentStep, welcomeMessage, welcomeDescription }: StepHeaderProps) {
   return (
      <div className="mb-4 text-center">
         <h1 className="mb-3 font-bold text-gray-800 text-3xl tracking-tight">
            {currentStep === 1 && (welcomeMessage || "¡Bienvenido a la plataforma!")}
            {currentStep === 2 && "Correos adicionales"}
            {currentStep === 3 && "¡Casi terminamos!"}
         </h1>
         <p className="text-gray-600 text-base leading-relaxed">
            {currentStep === 1 && (welcomeDescription || "Completa tu registro para acceder a la plataforma")}
            {currentStep === 2 && "Agrega correos electrónicos adicionales para iniciar sesión y recibir notificaciones"}
            {currentStep === 3 && "Completa tu perfil con estos últimos datos"}
         </p>
      </div>
   );
}
