import { Mail } from "lucide-react";
import { Button } from "@/components/global/Buttons";

export default function ConferencesAdminBar() {
   return (
      <div className="flex gap-2 py-2">
         <Button variant="dark" className="!p-2 !px-4 !rounded-lg">
            <Mail className="size-5" />
            <span className="capitalize">
               Enviar invitación a todos los ponentes
            </span>
         </Button>
      </div>
   );
}
