/* eslint-disable @next/next/no-img-element */
"use client";

import { ArrowLeftIcon, ArrowRight, CheckCircle2, FileText, User, Video } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "react-hot-toast";
import { Button } from "@/components/global/Buttons";
import ZoomCallInterface from "@/features/livestreams/components/ZoomCallInterface";
import UploadPresentationForm from "@/features/pptPresentations/components/UploadPresentationForm";
import { linkRecordingWithPresentationAction } from "../../serverActions/recordingPresentationsActions";
import RecordingLivestreamControlButtons from "../RecordingLivestreamControlButtons";
import HowToRecordTutorial from "../tutorials/HowToRecordTutorial";
import HowToUploadPresentationTutorial from "../tutorials/HowToUploadPresentationTutorial";
import PresentationAndCameraRecorder from "./PresentationAndCameraRecorder";

export default function CameraAndPresentationRecorderInterface({
   sessionTitle,
   initialPresentation,
   initialPresentationSlides,
   recordingId,
}: {
   sessionTitle: string;
   initialPresentation: PresentationRecord | null;
   initialPresentationSlides: PresentationSlideRecord[];
   recordingId: string;
}) {
   const [recorderStage, setRecorderStage] = useState<
      | "join_session"
      | "presentation_info"
      | "upload_presentation_tutorial"
      | "upload_presentation"
      | "presentation_recorder_tutorial"
      | "presentation_recorder"
      | "screen_share_recorder"
   >("join_session");
   const [presentationHasVideo, setPresentationHasVideo] = useState<boolean | null>(null);
   const [selectedPresentationOption, setSelectedPresentationOption] = useState<
      "no_videos" | "si_videos" | "no_ppt" | "zoom_video" | null
   >(null);
   const [username, setUsername] = useState<string>("");
   const [_linkingPresentation, startTransition] = useTransition();
   const [recordingPresentation, setRecordingPresentation] = useState<PresentationRecord | null>(() => {
      if (!initialPresentation) return null;
      return initialPresentation;
   });
   const [recordingPresentationSlides, setRecordingPresentationSlides] = useState<PresentationSlideRecord[]>(() => {
      if (!initialPresentationSlides) return [];
      return initialPresentationSlides;
   });

   const handleJoinSessionContinue = () => {
      if (initialPresentation && initialPresentationSlides.length > 0) {
         setRecorderStage("presentation_recorder_tutorial");
         return;
      }

      setRecorderStage("presentation_info");
   };

   const handlePresentationInfoContinue = () => {
      if (presentationHasVideo === true) {
         location.href = `/recordings/record/${recordingId}/upload-recording`;
      } else {
         setRecorderStage("upload_presentation_tutorial");
      }
   };

   const handleSavePresentation = ({
      presentation,
      presentationSlides,
   }: {
      presentation: PresentationRecord;
      presentationSlides: PresentationSlideRecord[];
   }) => {
      startTransition(async () => {
         const linkingResult = await linkRecordingWithPresentationAction({
            recordingId,
            presentationId: presentation.id,
         });
         if (!linkingResult.success) {
            toast.error(linkingResult.errorMessage);
            return;
         }

         toast.success("Diapositiva vinculada correctamente");
         setRecordingPresentation(presentation);
         setRecordingPresentationSlides(presentationSlides);
         setRecorderStage("presentation_recorder_tutorial");
      });
   };

   const zoomLogoURL = "https://res.cloudinary.com/dnx2lg7vb/image/upload/v1757811385/d151a6d1-ea9a-40de-92e6-f1da028a5e43.webp";

   if (recorderStage === "join_session") {
      return (
         <div className="!flex !justify-center !items-center !bg-linear-to-br !from-blue-50 !to-indigo-50 !p-4 min-h-screen!">
            <div className="!flex !flex-col !bg-white !shadow-xl !mx-auto !p-8 !rounded-2xl !w-full !max-w-md">
               <div className="!flex !flex-col !gap-6">
                  <div className="!text-center">
                     <div className="!bg-blue-100 !mx-auto !mb-4 !p-3 !rounded-full !w-16 !h-16">
                        <User className="!mx-auto !size-10 !text-blue-600" />
                     </div>
                     <h3 className="!mb-2 !font-bold !text-gray-900 !text-2xl">¡Bienvenido!</h3>
                     <p className="!text-gray-600 !leading-relaxed">Ingresa tu nombre para mostrarlo en la grabación</p>
                  </div>

                  <div className="!relative !flex !items-center">
                     <div className="!left-3 !absolute !text-gray-400">
                        <User size={20} />
                     </div>
                     <input
                        type="text"
                        value={username || ""}
                        onChange={(e) => setUsername(e.target.value)}
                        onKeyDown={(e) => {
                           if (e.key === "Enter" && username?.trim()) {
                              handleJoinSessionContinue();
                           }
                        }}
                        placeholder="Tu nombre"
                        className="!py-4 !pr-4 !pl-12 !border-2 !border-gray-200 !focus:border-blue-500 !rounded-xl !focus:outline-none !focus:ring-2 !focus:ring-blue-500 !w-full !text-base !transition-all"
                     />
                  </div>

                  <Button
                     variant="blue"
                     onClick={handleJoinSessionContinue}
                     disabled={!username?.trim()}
                     className="!flex !justify-center !items-center !gap-2 !bg-gradient-to-r !from-blue-500 hover:!from-blue-600 !to-blue-600 hover:!to-blue-700 !py-4 !rounded-xl !w-full !font-semibold !text-white hover:!scale-105 active:!scale-95 !transition-all !duration-200 !transform"
                  >
                     Continuar <ArrowRight size={20} />
                  </Button>
               </div>
            </div>
         </div>
      );
   }

   if (recorderStage === "presentation_info") {
      return (
         <div className="!flex justify-center! !items-center bg-linear-to-br! !from-purple-50 !to-pink-50 !p-4 !min-h-screen">
            <div className="!flex !flex-col !bg-white !shadow-xl !mx-auto !p-8 !rounded-2xl !w-full !max-w-lg">
               <div className="!flex !flex-col !gap-6">
                  <div className="!text-center">
                     <div className="!bg-purple-100 !mx-auto !mb-4 !p-3 !rounded-full !w-16 !h-16">
                        <FileText className="!mx-auto !size-10 !text-purple-600" />
                     </div>
                     <h3 className="!mb-2 !font-bold !text-gray-900 !text-2xl">Sobre tus diapositivas</h3>
                     <p className="!text-gray-600 !leading-relaxed">
                        Necesitamos como subirás tus diapositivas para poder grabar la sesión
                     </p>
                  </div>

                  <div className="!space-y-4">
                     {/* <h4 className="!font-semibold !text-gray-800 !text-center">¿Tus diapositivas contienen videos?</h4> */}

                     <div className="!gap-3 !grid !grid-cols-1">
                        <button
                           type="button"
                           onClick={() => {
                              setSelectedPresentationOption("no_videos");
                              setPresentationHasVideo(false);
                           }}
                           className={`!flex !items-center !gap-4 !p-4 !border-2 !rounded-xl !transition-all !duration-200 ${
                              selectedPresentationOption === "no_videos"
                                 ? "!border-blue-500 !bg-blue-50"
                                 : "!border-gray-200 !bg-white hover:!border-blue-300 hover:!bg-blue-25"
                           }`}
                        >
                           <div
                              className={`!rounded-full !p-2 ${
                                 selectedPresentationOption === "no_videos" ? "!bg-blue-500" : "!bg-gray-200"
                              }`}
                           >
                              <FileText
                                 className={`!size-5 ${
                                    selectedPresentationOption === "no_videos" ? "!text-white" : "!text-gray-500"
                                 }`}
                              />
                           </div>
                           <div className="!flex-1 !text-left">
                              <h5 className="!font-semibold !text-gray-900">
                                 Mis diapositivas NO Contienen videos o animaciones que se muevan
                              </h5>
                           </div>
                           {selectedPresentationOption === "no_videos" && <CheckCircle2 className="!size-6 !text-blue-500" />}
                        </button>

                        <button
                           type="button"
                           onClick={() => {
                              setSelectedPresentationOption("si_videos");
                              setPresentationHasVideo(true);
                           }}
                           className={`!flex !items-center !gap-4 !p-4 !border-2 !rounded-xl !transition-all !duration-200 ${
                              selectedPresentationOption === "si_videos"
                                 ? "!border-green-500 !bg-green-50"
                                 : "!border-gray-200 !bg-white hover:!border-green-300 hover:!bg-green-25"
                           }`}
                        >
                           <div
                              className={`!rounded-full !p-2 ${
                                 selectedPresentationOption === "si_videos" ? "!bg-green-500" : "!bg-gray-200"
                              }`}
                           >
                              <Video
                                 className={`!size-5 ${
                                    selectedPresentationOption === "si_videos" ? "!text-white" : "!text-gray-500"
                                 }`}
                              />
                           </div>
                           <div className="!flex-1 !text-left">
                              <h5 className="!font-semibold !text-gray-900">
                                 Mis diapositivas SI tienen videos o animaciones que se mueven
                              </h5>
                           </div>
                           {selectedPresentationOption === "si_videos" && <CheckCircle2 className="!size-6 !text-green-500" />}
                        </button>

                        <button
                           type="button"
                           onClick={() => {
                              setSelectedPresentationOption("no_ppt");
                              setPresentationHasVideo(true);
                           }}
                           className={`!flex !items-center !gap-4 !p-4 !border-2 !rounded-xl !transition-all !duration-200 ${
                              selectedPresentationOption === "no_ppt"
                                 ? "!border-purple-500 !bg-purple-50"
                                 : "!border-gray-200 !bg-white hover:!border-purple-300 hover:!bg-purple-25"
                           }`}
                        >
                           <div
                              className={`!rounded-full !p-2 ${
                                 selectedPresentationOption === "no_ppt" ? "!bg-purple-500" : "!bg-gray-200"
                              }`}
                           >
                              <FileText
                                 className={`!size-5 ${
                                    selectedPresentationOption === "no_ppt" ? "!text-white" : "!text-gray-500"
                                 }`}
                              />
                           </div>
                           <div className="!flex-1 !text-left">
                              <h5 className="!font-semibold !text-gray-900">
                                 Mi diapositiva está hecha en keynote, prezi-online u otro formato que no es de Powerpoint
                              </h5>
                           </div>
                           {selectedPresentationOption === "no_ppt" && <CheckCircle2 className="!size-6 !text-purple-500" />}
                        </button>

                        <button
                           type="button"
                           onClick={() => {
                              setSelectedPresentationOption("zoom_video");
                              setPresentationHasVideo(true);
                           }}
                           className={`!flex !items-center !gap-4 !p-4 !border-2 !rounded-xl !transition-all !duration-200 ${
                              selectedPresentationOption === "zoom_video"
                                 ? "!border-sky-500 !bg-sky-50"
                                 : "!border-gray-200 !bg-white hover:!border-sky-300 hover:!bg-sky-25"
                           }`}
                        >
                           <div
                              className={`!rounded-full !p-2 ${
                                 selectedPresentationOption === "zoom_video" ? "!bg-sky-500" : "!bg-gray-200"
                              }`}
                           >
                              <img src={zoomLogoURL} alt="Zoom" className="!w-5 !h-5" />
                           </div>
                           <div className="!flex-1 !text-left">
                              <h5 className="!font-semibold !text-gray-900">Voy a subir un video que grabé en zoom</h5>
                           </div>
                           {selectedPresentationOption === "zoom_video" && <CheckCircle2 className="!size-6 !text-sky-500" />}
                        </button>
                     </div>

                     {presentationHasVideo !== null && (
                        <div className="!bg-amber-50 !mt-4 !p-4 !border !border-amber-200 !rounded-xl">
                           <div className="!flex !items-start !gap-3">
                              <div className="!flex-shrink-0 !bg-amber-200 !p-1 !rounded-full">
                                 <Video className="!size-4 !text-amber-700" />
                              </div>
                              <div>
                                 <h6 className="!font-semibold !text-amber-900 !text-sm">Información importante</h6>
                                 <p className="!mt-1 !text-amber-800 !text-xs !leading-relaxed">
                                    {presentationHasVideo
                                       ? "Para diapositivas con video. Deberás grabar tu video y subirlo al sistema."
                                       : "Perfecto. Puedes subir tu diapositiva al sistema."}
                                 </p>
                              </div>
                           </div>
                        </div>
                     )}
                  </div>

                  <div className="!flex !sm:flex-row !flex-col !gap-3 !mt-6">
                     <Button
                        variant="secondary"
                        onClick={() => setRecorderStage("join_session")}
                        className="!flex !justify-center !items-center !gap-2 !py-3 !rounded-xl !w-full !sm:w-auto !font-medium"
                     >
                        Atrás
                     </Button>

                     <Button
                        variant="purple"
                        onClick={handlePresentationInfoContinue}
                        disabled={selectedPresentationOption === null}
                        className="!flex !justify-center !items-center !gap-2 !bg-gradient-to-r !from-purple-500 hover:!from-purple-600 !to-purple-600 hover:!to-purple-700 !py-3 !rounded-xl !w-full !font-semibold !text-white hover:!scale-105 active:!scale-95 !transition-all !duration-200 !transform"
                     >
                        Continuar <ArrowRight size={20} />
                     </Button>
                  </div>
               </div>
            </div>
         </div>
      );
   }

   if (recorderStage === "upload_presentation_tutorial") {
      return (
         <div>
            <Button variant="primary" onClick={() => setRecorderStage("presentation_info")}>
               <ArrowLeftIcon className="size-5" />
               Regresar
            </Button>
            <HowToUploadPresentationTutorial onFinish={() => setRecorderStage("upload_presentation")} />
         </div>
      );
   }

   if (recorderStage === "upload_presentation") {
      return (
         <div className="!px-4">
            <Button variant="primary" onClick={() => setRecorderStage("presentation_info")}>
               <ArrowLeftIcon className="size-5" />
               Regresar
            </Button>
            <UploadPresentationForm onPresentationSaved={handleSavePresentation} />
         </div>
      );
   }

   if (recorderStage === "presentation_recorder_tutorial") {
      return (
         <div>
            <HowToRecordTutorial onFinish={() => setRecorderStage("presentation_recorder")} />
         </div>
      );
   }

   if (recorderStage === "presentation_recorder") {
      return (
         <PresentationAndCameraRecorder
            recordingId={recordingId}
            recordingPresentation={recordingPresentation}
            recordingPresentationSlides={recordingPresentationSlides}
            sessionTitle={sessionTitle}
            presentationHasVideo={presentationHasVideo}
            username={username}
         />
      );
   }

   if (recorderStage === "screen_share_recorder") {
      return (
         <div className="!bg-gray-100 !min-h-screen">
            <div className="!bg-white !shadow-lg !mb-6 !p-4 !rounded-2xl">
               <div className="!flex !justify-center !mt-6">
                  <RecordingLivestreamControlButtons sessionTitle={sessionTitle} />
               </div>
               <ZoomCallInterface
                  initialUsername={username}
                  allowScreenShare={presentationHasVideo === true}
                  className="!w-auto !max-h-[80dvh]"
                  isHostByDefault={true}
               />
            </div>
         </div>
      );
   }

   return <div>unreachable</div>;
}
