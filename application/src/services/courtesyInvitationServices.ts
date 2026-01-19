import "server-only";
import { ClientResponseError, RecordModel } from "pocketbase";
import { getLatestCongress } from "@/features/congresses/services/congressServices";
import { getOrganizationFromSubdomain } from "@/features/organizations/services/organizationServices";
import pbServerClient from "@/libs/pbServerClient";
import { getFullDBRecordsList, pbFilter } from "@/libs/pbServerClientNew";
import { CourtesyInvitation } from "@/types/congress";
import PB_COLLECTIONS from "@/types/constants/pocketbaseCollections";
import { createStripePromotionCode } from "./stripeServices";
import { setRegistrationAsCourtesyGuest } from "./userRegistrationServices";

export async function getAllCourtesyInvitations() {
   const organization = await getOrganizationFromSubdomain();
   const congress = await getLatestCongress();

   const filter = pbFilter(
      `
      organization = {:organizationId} &&
      congress = {:congressId}
   `,
      {
         organizationId: organization.id,
         congressId: congress.id,
      },
   );
   const courtesyInvitations = await getFullDBRecordsList<CourtesyInvitation>(
      "COURTESY_INVITATIONS",
      {
         filter,
      },
   );

   return courtesyInvitations;
}

export async function generateMultipleCourtesyInvitationCodes(
   congressId: string,
   quantity: number,
) {
   const organization = await getOrganizationFromSubdomain();
   for (let i = 0; i < quantity; i++) {
      await createCourtesyInvitationCode(congressId, organization.id);
   }
}

export async function createCourtesyInvitationCode(
   congressId: string,
   organizationId: string,
) {
   const courtesyCuponId = "EqO90OPA";

   const strypePromotionCode = await createStripePromotionCode(
      courtesyCuponId,
      1,
   );

   const newCourtesyInvitationCode: CourtesyInvitation = {
      congress: congressId,
      organization: organizationId,
      stripePromotionCode: strypePromotionCode,
      used: false,
   };

   const courtesyInvitationCreated = await pbServerClient
      .collection(PB_COLLECTIONS.COURTESY_INVITATIONS)
      .create<CourtesyInvitation & RecordModel>(newCourtesyInvitationCode);

   return courtesyInvitationCreated;
}

export async function getCourtesyInvitationByStryipePromoCode(
   stripePromotionCode: string,
) {
   try {
      const courtesyInvitationCode = await pbServerClient
         .collection(PB_COLLECTIONS.COURTESY_INVITATIONS)
         .getFirstListItem<CourtesyInvitation & RecordModel>(
            `stripePromotionCode = "${stripePromotionCode}"`,
         );
      return courtesyInvitationCode;
   } catch (error) {
      if (error instanceof ClientResponseError && error.status === 404) {
         return null;
      }
      throw error;
   }
}

export async function redeemCourtesyInvitationCode(
   stripePromotionCode: string,
   user: User & RecordModel,
) {
   const courtesyInvitation =
      await getCourtesyInvitationByStryipePromoCode(stripePromotionCode);
   if (!courtesyInvitation) {
      return;
   }

   await pbServerClient
      .collection(PB_COLLECTIONS.COURTESY_INVITATIONS)
      .update(courtesyInvitation.id, {
         used: true,
         redeemedAt: new Date().toISOString(),
         userWhoRedeemed: user.id,
      } as Partial<CourtesyInvitation>);

   await setRegistrationAsCourtesyGuest(user.id, courtesyInvitation.congress);

   console.log("Redeemed courtesy invitation code by: ", user.id);
}
