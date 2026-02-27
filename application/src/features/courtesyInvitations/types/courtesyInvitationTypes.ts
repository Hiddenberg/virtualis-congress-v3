import type { CongressRecord } from "@/features/congresses/types/congressTypes";
import type { OrganizationRecord } from "@/features/organizations/types/organizationTypes";
import type { UserRecord } from "@/features/users/types/userTypes";

export interface CourtesyInvitation {
   organization: OrganizationRecord["id"];
   congress: CongressRecord["id"];
   stripePromotionCode: string;
   used: boolean;
   tag: string;
   userWhoRedeemed?: UserRecord["id"];
   sentTo?: string;
   redeemedAt?: string;
}

export type CourtesyInvitationRecord = DBRecordItem<CourtesyInvitation>;

export type CourtesyInvitationWithUsersNames = {
   courtesyInvitation: CourtesyInvitationRecord;
   userWhoRedeemed?: UserRecord["name"];
};
