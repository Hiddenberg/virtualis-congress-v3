import type { RecordModel } from "pocketbase";
import CourtesyInvitationsTable from "@/components/congress-admin/courtesy-invitations/CourtesyInvitationsTable";
import type { CourtesyInvitation } from "@/types/congress";

export default async function CourtesyInvitationsPage() {
   const invitations: (CourtesyInvitation & RecordModel)[] = [];
   return (
      <div className="flex flex-col justify-center items-center">
         <h1 className="font-bold text-3xl">Courtesy Invitations</h1>

         <CourtesyInvitationsTable invitations={invitations} />
      </div>
   );
}
