import CourtesyInvitationsTable from "@/components/congress-admin/courtesy-invitations/CourtesyInvitationsTable";
import { getAllCourtesyInvitations } from "@/services/courtesyInvitationServices";

export default async function CourtesyInvitationsPage() {
   const invitations = await getAllCourtesyInvitations();
   return (
      <div className="flex flex-col justify-center items-center">
         <h1 className="font-bold text-3xl">Courtesy Invitations</h1>

         <CourtesyInvitationsTable invitations={invitations} />
      </div>
   );
}
