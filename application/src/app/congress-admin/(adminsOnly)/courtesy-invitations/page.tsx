import { GiftIcon, PlusIcon } from "lucide-react";
import AdminSubPageHeader from "@/components/congress-admin/AdminSubPageHeader";
import CourtesyInvitationsTable from "@/components/congress-admin/courtesy-invitations/CourtesyInvitationsTable";
import { LinkButton } from "@/components/global/Buttons";
import { getLatestCongress } from "@/features/congresses/services/congressServices";
import { getAllCourtesyInvitationsWithUsersNames } from "@/features/courtesyInvitations/services/courtesyInvitationServices";

export default async function CourtesyInvitationsPage() {
   const congress = await getLatestCongress();
   const invitationsWithUsersNames = await getAllCourtesyInvitationsWithUsersNames(congress.id);

   return (
      <div>
         <AdminSubPageHeader
            title="Invitaciones de Cortesía"
            description="Gestiona y administra las invitaciones de cortesía para el congreso"
            Icon={GiftIcon}
            sideElement={
               <LinkButton href="/congress-admin/courtesy-invitations/create" variant="blue">
                  <PlusIcon className="size-4" />
                  Crear invitación
               </LinkButton>
            }
         />

         <CourtesyInvitationsTable invitationsWithUsersNames={invitationsWithUsersNames} />
      </div>
   );
}
