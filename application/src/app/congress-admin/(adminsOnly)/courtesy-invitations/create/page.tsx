import { GiftIcon } from "lucide-react";
import AdminSubPageHeader from "@/components/congress-admin/AdminSubPageHeader";
import CourtesyInvitationForm from "@/components/congress-admin/courtesy-invitations/CourtesyInvitationForm";
import GoBackButton from "@/components/global/GoBackButton";

export default function CourtesyInvitationsCreatePage() {
   return (
      <div>
         <GoBackButton
            backURL="/congress-admin/courtesy-invitations"
            backButtonText="Volver a invitaciones de cortesía"
            className="mb-4"
         />
         <AdminSubPageHeader
            title="Crear invitación de cortesía"
            Icon={GiftIcon}
            description="Crea una nueva invitación de cortesía para el congreso"
         />

         <CourtesyInvitationForm />
      </div>
   );
}
