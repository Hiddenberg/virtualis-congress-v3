import "server-only";
import { getOrganizationFromSubdomain } from "@/features/organizations/services/organizationServices";
import { createDBRecord, getDBRecordById, getFullDBRecordsList, pbFilter } from "@/libs/pbServerClientNew";
import type { SlideImage } from "./convertapiServices";

export async function createPresentationRecord(presentation: Presentation) {
   const createdPresentation = await createDBRecord<Presentation>("PRESENTATIONS", {
      ...presentation,
   } satisfies Presentation);

   return createdPresentation;
}

export async function createPresentationSlideRecord(slide: PresentationSlide) {
   const createdSlide = await createDBRecord<PresentationSlide>("PRESENTATION_SLIDES", {
      ...slide,
   } satisfies PresentationSlide);

   return createdSlide;
}

export interface SavePresentationAndSlidesParams {
   name: string;
   file: File;
   slides: SlideImage[];
   hasVideo: boolean;
}

export async function getPresentationById(presentationId: string) {
   const presentation = await getDBRecordById<Presentation>("PRESENTATIONS", presentationId);
   return presentation;
}

export async function getPresentationSlidesById(presentationId: string) {
   const organization = await getOrganizationFromSubdomain();
   const filter = pbFilter(
      `
      organization = {:organizationId} &&
      presentation = {:presentationId}
   `,
      {
         organizationId: organization.id,
         presentationId,
      },
   );
   const slides = await getFullDBRecordsList<PresentationSlide>("PRESENTATION_SLIDES", {
      filter,
   });

   return slides;
}

export async function savePresentationAndSlides({ name, file, slides, hasVideo }: SavePresentationAndSlidesParams): Promise<{
   presentation: PresentationRecord;
   presentationSlides: PresentationSlideRecord[];
}> {
   const organization = await getOrganizationFromSubdomain();

   // 1) Create presentation record with original file
   const presentation = await createPresentationRecord({
      organization: organization.id,
      name,
      file,
      hasVideo,
   } satisfies Presentation);

   // 2) Download each slide and create slide records
   const createdSlides: PresentationSlideRecord[] = [];

   // Run sequentially to avoid hammering remote provider or PB with too many parallel uploads
   for (let index = 0; index < slides.length; index++) {
      const slide = slides[index];

      const response = await fetch(slide.url);
      if (!response.ok) {
         throw new Error(`No se pudo descargar la diapositiva ${index + 1}`);
      }
      const arrayBuffer = await response.arrayBuffer();
      const imageFile = new File([arrayBuffer], slide.fileName || `slide_${index + 1}.webp`, {
         type: "image/webp",
      });

      const createdPresentationSlide = await createPresentationSlideRecord({
         organization: organization.id,
         presentation: presentation.id,
         slideIndex: index,
         image: imageFile,
      } satisfies PresentationSlide);

      createdSlides.push(createdPresentationSlide);
   }

   return {
      presentation,
      presentationSlides: createdSlides,
   };
}
