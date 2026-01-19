"use client";

import { useQuery } from "@tanstack/react-query";
import PresentationViewer from "./PresentationShower";

export default function SelfContainedPresentationShower({
   presentationId,
}: {
   presentationId: string;
}) {
   const { data, isLoading } = useQuery<PresentationSlideRecord[]>({
      queryKey: ["presentation"],
      queryFn: async () => {
         const response = await fetch(
            `/api/presentation/${presentationId}/slides`,
         );
         const data = await response.json();
         return data;
      },
      enabled: !!presentationId,
   });

   if (isLoading) {
      return <div>Loading...</div>;
   }

   if (!data) {
      return <div>No hay diapositivas para mostrar</div>;
   }

   return <PresentationViewer presentationSlides={data} />;
}
