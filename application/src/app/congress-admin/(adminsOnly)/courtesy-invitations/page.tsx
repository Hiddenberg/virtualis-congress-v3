import CourtesyInvitationsTable from "@/components/congress-admin/courtesy-invitations/CourtesyInvitationsTable";
import type { CourtesyInvitationRecord } from "@/features/courtesyInvitations/types/courtesyInvitationTypes";

export default async function CourtesyInvitationsPage() {
   const invitations: CourtesyInvitationRecord[] = [];
   return (
      <div className="flex flex-col justify-center items-center">
         <h1 className="font-bold text-3xl">Invitaciones de Cortesía</h1>

         <CourtesyInvitationsTable invitations={invitations} />
      </div>
   );
}
