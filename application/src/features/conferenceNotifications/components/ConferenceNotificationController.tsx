"use client";

import { addMinute, isAfter, isBefore } from "@formkit/tempo";
import { useQuery } from "@tanstack/react-query";
import { ArrowRightIcon, BellRingIcon, XIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/global/Buttons";
import backendFetcher from "@/features/backendFetcher/utils/backendFetcher";

interface ConferenceNotificationProps {
   conferenceTitle: string;
   conferenceId: string;
}

function ConferenceNotification({ conferenceTitle, conferenceId }: ConferenceNotificationProps) {
   const router = useRouter();
   const handleGoToConference = () => {
      router.push(`/conference/${conferenceId}`);
      toast.dismiss();
   };
   return (
      <div className="flex items-center gap-4 p-1 min-w-[320px]">
         <button
            type="button"
            className="top-2 right-2 absolute hover:bg-gray-100 p-1.5 rounded-md text-gray-500"
            onClick={() => toast.dismiss()}
         >
            <XIcon strokeWidth={3} className="size-5 text-red-500" />
         </button>
         {/* Icon container with gradient background */}
         <div className="bg-linear-to-br from-blue-500 to-blue-600 shadow-md p-3 rounded-xl shrink-0">
            <BellRingIcon className="size-4 text-white" />
         </div>

         {/* Content */}
         <div className="flex-1 space-y-3">
            <div>
               <h3 className="mb-1 font-bold text-gray-900 text-base">¡Próxima conferencia!</h3>
               <p className="text-gray-700 text-sm leading-relaxed">
                  <span className="font-semibold text-blue-600">{conferenceTitle}</span> comenzará en 1 minuto
               </p>
            </div>

            <Button onClick={handleGoToConference} variant="green" className="px-3! py-2! w-full! text-sm">
               Ir a la conferencia
               <ArrowRightIcon className="size-4" />
            </Button>
         </div>
      </div>
   );
}

export default function ConferenceNotificationController() {
   const { data: allCongressConferencesResponse } = useQuery({
      queryKey: ["all-congress-conferences"],
      queryFn: () => backendFetcher<{ conferences: CongressConferenceRecord[] }>("/api/conferences"),
      staleTime: 1000 * 60 * 60, // 1 hour
   });

   const params = useParams<{ conferenceId?: string }>();
   const paramConferenceId = params.conferenceId;
   const conferencesNotifiedRef = useRef<CongressConferenceRecord["id"][]>([]);

   useEffect(() => {
      const interval = setInterval(() => {
         const conferences = allCongressConferencesResponse?.conferences;
         const currentDateTime = new Date();

         // Check if there is an upcoming conference within the next 1 minute
         const upcomingConference = conferences?.find(
            (conference) =>
               isAfter(conference.startTime, currentDateTime) && isBefore(conference.startTime, addMinute(currentDateTime, 1)),
         );

         if (upcomingConference) {
            // If the user is already in the conference page, don't show the notification
            if (upcomingConference.id === paramConferenceId) {
               return;
            }

            // If the user has already been notified about this conference, don't show the notification
            if (conferencesNotifiedRef.current.includes(upcomingConference.id)) {
               return;
            }

            // Send notification to the user
            toast(<ConferenceNotification conferenceTitle={upcomingConference.title} conferenceId={upcomingConference.id} />, {
               duration: 60000, // 1 minute
            });
            conferencesNotifiedRef.current.push(upcomingConference.id);
         } else {
            // If there is no upcoming conference, don't show the notification
            return;
         }
      }, 10000);
      return () => clearInterval(interval);
   }, [allCongressConferencesResponse, paramConferenceId]);

   return null;
}
