import "server-only";
import { COURTESY_STRIPE_COUPON_ID } from "@/data/constants/platformConstants";
import {
   getCongressRegistrationByUserId,
   updateCongressRegistration,
} from "@/features/congresses/services/congressRegistrationServices";
import { getLatestCongress } from "@/features/congresses/services/congressServices";
import { sendCourtesyInvitationEmail } from "@/features/emails/services/emailSendingServices";
import { getOrganizationFromSubdomain } from "@/features/organizations/services/organizationServices";
import type { UserRecord } from "@/features/users/types/userTypes";
import { createDBRecord, getFullDBRecordsList, getSingleDBRecord, pbFilter, updateDBRecord } from "@/libs/pbServerClientNew";
import { createStripeCoupon, createStripePromotionCode, getStripeCouponById } from "../../../services/stripeServices";
import type {
   CourtesyInvitation,
   CourtesyInvitationRecord,
   CourtesyInvitationWithUsersNames,
} from "../types/courtesyInvitationTypes";

export async function createCourtesyInvitationRecord(newCourtesyInvitationData: CourtesyInvitation) {
   const newCourtesyInvitationRecord = await createDBRecord<CourtesyInvitation>(
      "COURTESY_INVITATIONS",
      newCourtesyInvitationData,
   );
   return newCourtesyInvitationRecord;
}

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
   const courtesyInvitations = await getFullDBRecordsList<CourtesyInvitation>("COURTESY_INVITATIONS", {
      filter,
   });

   return courtesyInvitations;
}

export async function getAllCourtesyInvitationsWithUsersNames(congressId: string): Promise<CourtesyInvitationWithUsersNames[]> {
   const organization = await getOrganizationFromSubdomain();
   const filter = pbFilter(
      `
      organization = {:organizationId} &&
      congress = {:congressId}
   `,
      {
         organizationId: organization.id,
         congressId,
      },
   );
   const expandedCourtesyInvitations = await getFullDBRecordsList<
      CourtesyInvitation & {
         expand: {
            userWhoRedeemed?: {
               name: UserRecord["name"];
            };
         };
      }
   >("COURTESY_INVITATIONS", {
      filter,
      fields: "*, expand.userWhoRedeemed.name",
      expand: "userWhoRedeemed",
   });

   const courtesyInvitationsWithUsers = expandedCourtesyInvitations.map((expandedCourtesyInvitation) => {
      const userWhoRedeemedName = expandedCourtesyInvitation.expand.userWhoRedeemed?.name;
      const courtesyInvitation: CourtesyInvitationRecord = {
         id: expandedCourtesyInvitation.id,
         collectionId: expandedCourtesyInvitation.collectionId,
         collectionName: expandedCourtesyInvitation.collectionName,
         created: expandedCourtesyInvitation.created,
         updated: expandedCourtesyInvitation.updated,
         organization: expandedCourtesyInvitation.organization,
         congress: expandedCourtesyInvitation.congress,
         stripePromotionCode: expandedCourtesyInvitation.stripePromotionCode,
         used: expandedCourtesyInvitation.used,
         tag: expandedCourtesyInvitation.tag,
         userWhoRedeemed: expandedCourtesyInvitation.userWhoRedeemed,
         sentTo: expandedCourtesyInvitation.sentTo,
         redeemedAt: expandedCourtesyInvitation.redeemedAt,
      };

      return {
         courtesyInvitation,
         userWhoRedeemed: userWhoRedeemedName,
      };
   });

   return courtesyInvitationsWithUsers;
}

export async function getCourtesyStripeCoupon() {
   const existingCourtesyCoupon = await getStripeCouponById(COURTESY_STRIPE_COUPON_ID);
   if (existingCourtesyCoupon) {
      return existingCourtesyCoupon;
   }

   const newCourtesyCoupon = await createStripeCoupon({
      couponName: "Invitación de Cortesía",
      percentOff: 100,
      duration: "forever",
      stripeCouponId: COURTESY_STRIPE_COUPON_ID,
   });

   return newCourtesyCoupon;
}

export async function generateMultipleCourtesyInvitationCodes(congressId: string, quantity: number, tag: string = "") {
   const organization = await getOrganizationFromSubdomain();
   for (let i = 0; i < quantity; i++) {
      await createCourtesyInvitationCode(congressId, organization.id, tag);
   }
}

export async function createCourtesyInvitationCode(congressId: string, organizationId: string, tag: string = "") {
   const courtesyStripeCoupon = await getCourtesyStripeCoupon();
   const strypePromotionCode = await createStripePromotionCode(courtesyStripeCoupon.id, 1);

   const newCourtesyInvitationCode: CourtesyInvitation = {
      congress: congressId,
      organization: organizationId,
      stripePromotionCode: strypePromotionCode,
      used: false,
      tag,
   };

   const courtesyInvitationCreated = await createCourtesyInvitationRecord(newCourtesyInvitationCode);

   return courtesyInvitationCreated;
}

const PERSONALIZED_INVITATION_TAG = "personalizada";

export async function createSingleCourtesyInvitationAndSendEmail({
   email,
   recipientName,
}: {
   email: string;
   recipientName?: string;
}) {
   const organization = await getOrganizationFromSubdomain();
   const congress = await getLatestCongress();

   const courtesyInvitation = await createCourtesyInvitationCode(congress.id, organization.id, PERSONALIZED_INVITATION_TAG);

   await updateCourtesyInvitationRecord({
      courtesyInvitationId: courtesyInvitation.id,
      updatedData: { sentTo: email },
   });

   await sendCourtesyInvitationEmail({
      to: email,
      promoCode: courtesyInvitation.stripePromotionCode,
      recipientName,
   });

   return courtesyInvitation;
}

export async function getCourtesyInvitationByStripePromoCode(stripePromotionCode: string) {
   const organization = await getOrganizationFromSubdomain();
   const filter = pbFilter(
      `
      organization = {:organizationId} &&
      stripePromotionCode = {:stripePromotionCode}
      `,
      {
         organizationId: organization.id,
         stripePromotionCode,
      },
   );
   const courtesyInvitationCode = await getSingleDBRecord<CourtesyInvitation>("COURTESY_INVITATIONS", filter);

   return courtesyInvitationCode;
}

export async function updateCourtesyInvitationRecord({
   courtesyInvitationId,
   updatedData,
}: {
   courtesyInvitationId: string;
   updatedData: Partial<CourtesyInvitation>;
}) {
   const updatedCourtesyInvitation = await updateDBRecord<CourtesyInvitation>(
      "COURTESY_INVITATIONS",
      courtesyInvitationId,
      updatedData,
   );
   return updatedCourtesyInvitation;
}

export async function redeemCourtesyInvitationCode(stripePromotionCode: string, user: UserRecord) {
   const courtesyInvitation = await getCourtesyInvitationByStripePromoCode(stripePromotionCode);
   if (!courtesyInvitation) {
      throw new Error(
         `[Redeem Courtesy Invitation Code] Courtesy invitation not found with stripe promotion code ${stripePromotionCode}`,
      );
   }

   const congressRegistration = await getCongressRegistrationByUserId(user.id);
   if (!congressRegistration) {
      throw new Error(`[Redeem Courtesy Invitation Code] Congress registration not found for user ${user.id}`);
   }

   await updateCourtesyInvitationRecord({
      courtesyInvitationId: courtesyInvitation.id,
      updatedData: {
         used: true,
         userWhoRedeemed: user.id,
      },
   });

   await updateCongressRegistration(congressRegistration.id, {
      registrationType: "courtesy",
   });
   console.log("Redeemed courtesy invitation code by: ", user.id);
}
