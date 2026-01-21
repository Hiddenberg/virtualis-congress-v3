import { PlusIcon, VideoIcon } from "lucide-react";
import { LinkButton } from "@/components/global/Buttons";

export default function EmptyRecordingState() {
   return (
      <div className="flex flex-col justify-center items-center py-16 text-center">
         <div className="bg-gray-100 mb-6 p-6 rounded-full">
            <VideoIcon className="size-12 text-gray-400" />
         </div>

         <h2 className="mb-2 font-semibold text-gray-900 text-xl">No hay grabaciones disponibles</h2>

         <p className="mb-8 max-w-md text-gray-600">
            Comienza creando tu primera grabación. Podrás invitar a personas para que graben sus presentaciones y administrar todo
            desde aquí.
         </p>

         <LinkButton href="/recordings/create">
            <PlusIcon className="size-5" />
            Crear mi primera grabación
         </LinkButton>
      </div>
   );
}
