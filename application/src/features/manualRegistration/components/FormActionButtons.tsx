import Link from "next/link";
import { Button } from "@/components/global/Buttons";

interface FormActionButtonsProps {
   canSubmit: boolean;
   isPending: boolean;
   onSubmit: () => void;
}

export function FormActionButtons({ canSubmit, isPending, onSubmit }: FormActionButtonsProps) {
   return (
      <div className="flex sm:flex-row flex-col gap-3 pt-6 border-gray-100 border-t">
         <Button
            type="button"
            onClick={onSubmit}
            disabled={!canSubmit || isPending}
            loading={isPending}
            variant="blue"
            className="flex-1"
         >
            {isPending ? "Creando usuario..." : "Crear Usuario"}
         </Button>

         <Link
            href="/manual-registration"
            className="flex justify-center items-center gap-2 bg-white hover:bg-gray-50 px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 transition-colors"
         >
            Cancelar
         </Link>
      </div>
   );
}
