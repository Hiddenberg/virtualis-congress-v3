import { CheckCircleIcon, LightbulbIcon, VideoIcon } from "lucide-react";
import Image from "next/image";
import { LinkButton } from "@/components/global/Buttons";

export default async function AcpInstructionsPage({ params }: { params: Promise<{ recordingId: string }> }) {
   const { recordingId } = await params;

   return (
      <div className="bg-linear-to-br from-green-50 to-emerald-50 py-8 min-h-screen">
         <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
            {/* Header */}
            <div className="mb-8 text-center">
               <div className="mb-6">
                  <Image
                     src="https://res.cloudinary.com/dnx2lg7vb/image/upload/v1741918846/Disen%CC%83o_sin_ti%CC%81tuloacofondo_clipped_rev_1_jzmcwt.png"
                     alt="ACP Mexico Chapter Logo"
                     width={400}
                     height={120}
                     className="mx-auto"
                     priority
                  />
               </div>
               <h1 className="mb-2 font-light text-gray-900 text-3xl">🎥 Comparte tu Orgullo de Ser Parte del ACP México</h1>
               <p className="text-gray-600 text-lg">Una campaña especial para resaltar nuestra comunidad médica</p>
            </div>

            {/* Main Content */}
            <div className="space-y-6">
               {/* Introduction */}
               <div className="bg-white shadow-sm border border-gray-200 rounded-lg">
                  <div className="p-6 pb-4 border-gray-100 border-b">
                     <h2 className="flex items-center gap-2 font-semibold text-gray-900 text-lg">
                        <LightbulbIcon className="size-5 text-green-600" />
                        Acerca de esta campaña
                     </h2>
                  </div>
                  <div className="p-6">
                     <p className="text-gray-700 leading-relaxed">
                        En el American College of Physicians (ACP) Capítulo México, queremos resaltar el orgullo y la inspiración
                        que representa formar parte de nuestra comunidad médica. Para ello, estamos lanzando una campaña de videos
                        cortos donde cada miembro podrá compartir, en un minuto, por qué está orgulloso de pertenecer al ACP.
                     </p>
                  </div>
               </div>

               {/* Question */}
               <div className="bg-green-50 shadow-sm border border-green-200 border-l-4 border-l-green-500 rounded-lg">
                  <div className="p-6">
                     <h2 className="mb-3 font-semibold text-green-800 text-xl">La pregunta que debes responder:</h2>
                     <div className="bg-white p-4 border border-green-200 rounded-lg">
                        <p className="font-medium text-green-900 text-lg text-center">
                           &ldquo;¿Por qué estás orgulloso(a) de ser parte del ACP Capítulo México?&rdquo;
                        </p>
                     </div>
                     <p className="mt-3 text-green-700 text-sm">
                        Queremos que sea algo auténtico y personal: puede ser una experiencia vivida, un valor que compartas, el
                        impacto académico o profesional que has recibido, o simplemente lo que el ACP significa para ti.
                     </p>
                  </div>
               </div>

               {/* Instructions */}
               <div className="bg-white shadow-sm border border-gray-200 rounded-lg">
                  <div className="p-6 pb-4 border-gray-100 border-b">
                     <h2 className="flex items-center gap-2 font-semibold text-gray-900 text-lg">
                        <CheckCircleIcon className="size-5 text-green-600" />
                        Indicaciones para grabar
                     </h2>
                  </div>
                  <div className="p-6">
                     <ul className="space-y-3">
                        <li className="flex items-start gap-3">
                           <div className="bg-green-100 mt-0.5 p-1 rounded-full">
                              <CheckCircleIcon className="size-4 text-green-600" />
                           </div>
                           <span className="text-gray-700">Haz click en el botón para grabar tu video.</span>
                        </li>
                        <li className="flex items-start gap-3">
                           <div className="bg-green-100 mt-0.5 p-1 rounded-full">
                              <CheckCircleIcon className="size-4 text-green-600" />
                           </div>
                           <span className="text-gray-700">
                              Podrás ver tu video antes de enviarlo y repetir la grabación si lo deseas.
                           </span>
                        </li>
                        <li className="flex items-start gap-3">
                           <div className="bg-green-100 mt-0.5 p-1 rounded-full">
                              <CheckCircleIcon className="size-4 text-green-600" />
                           </div>
                           <span className="text-gray-700">
                              Asegúrate de estar en un lugar bien iluminado y sin ruido de fondo.
                           </span>
                        </li>
                        <li className="flex items-start gap-3">
                           <div className="bg-green-100 mt-0.5 p-1 rounded-full">
                              <CheckCircleIcon className="size-4 text-green-600" />
                           </div>
                           <span className="text-gray-700">
                              Habla con claridad y si lo deseas, usa tu bata o distintivos del ACP.
                           </span>
                        </li>
                        <li className="flex items-start gap-3">
                           <div className="bg-green-100 mt-0.5 p-1 rounded-full">
                              <CheckCircleIcon className="size-4 text-green-600" />
                           </div>
                           <span className="text-gray-700">
                              <strong>El video debe tener una duración máxima de 1 minuto</strong>
                           </span>
                        </li>
                     </ul>
                  </div>
               </div>

               {/* Impact */}
               <div className="bg-emerald-50 shadow-sm border border-emerald-200 rounded-lg">
                  <div className="p-6">
                     <h3 className="mb-3 font-semibold text-emerald-800 text-lg">Tu impacto en la comunidad</h3>
                     <p className="text-emerald-700 leading-relaxed">
                        Tu participación será parte de una campaña nacional para promover el sentido de pertenencia, liderazgo y
                        comunidad científica del ACP en México.
                     </p>
                  </div>
               </div>

               {/* Call to Action */}
               <div className="bg-linear-to-r from-green-100 to-emerald-100 shadow-sm border border-green-300 rounded-lg">
                  <div className="p-6 text-center">
                     <h3 className="mb-3 font-semibold text-gray-900 text-xl">¡Listo para compartir tu historia!</h3>
                     <p className="mb-6 text-gray-700">
                        Gracias por compartir tu voz y ayudarnos a construir un mensaje que inspire a más médicos a formar parte
                        de esta gran familia.
                     </p>
                     <LinkButton
                        href={`/recordings/record/${recordingId}`}
                        className="bg-green-600 hover:bg-green-700 mx-auto px-8 py-3 text-white text-lg"
                        variant="none"
                     >
                        <VideoIcon className="size-5" />
                        Comenzar Grabación
                     </LinkButton>
                  </div>
               </div>

               {/* Footer Note */}
               <div className="bg-gray-50 shadow-sm border border-gray-200 rounded-lg">
                  <div className="p-6">
                     <p className="text-gray-600 text-sm text-center">
                        <strong>Nota:</strong> Por el momento esta campaña la realizaremos los del comité de comunicaciones y
                        posteriormente se escalará a los otros comités y a todos los miembros.
                        <br />
                        <strong>Muchas gracias por ser parte del ACP.</strong>
                     </p>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}
