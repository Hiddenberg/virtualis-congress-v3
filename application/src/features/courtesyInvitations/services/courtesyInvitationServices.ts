import "server-only";
import { COURTESY_STRIPE_COUPON_ID } from "@/data/constants/platformConstants";
import { sendCourtesyInvitationEmail } from "@/features/emails/services/emailSendingServices";
import {
   getCongressRegistrationByUserId,
   updateCongressRegistration,
} from "@/features/congresses/services/congressRegistrationServices";
import { getLatestCongress } from "@/features/congresses/services/congressServices";
import { getOrganizationFromSubdomain } from "@/features/organizations/services/organizationServices";
import type { UserRecord } from "@/features/users/types/userTypes";
import { createDBRecord, getFullDBRecordsList, getSingleDBRecord, pbFilter, updateDBRecord } from "@/libs/pbServerClientNew";
import { createStripeCoupon, createStripePromotionCode, getStripeCouponById } from "../../../services/stripeServices";
import type { CourtesyInvitation } from "../types/courtesyInvitationTypes";

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

export async function generateMultipleCourtesyInvitationCodes(congressId: string, quantity: number) {
   const organization = await getOrganizationFromSubdomain();
   for (let i = 0; i < quantity; i++) {
      await createCourtesyInvitationCode(congressId, organization.id);
   }
}

export async function createCourtesyInvitationCode(congressId: string, organizationId: string) {
   const courtesyStripeCoupon = await getCourtesyStripeCoupon();
   const strypePromotionCode = await createStripePromotionCode(courtesyStripeCoupon.id, 1);

   const newCourtesyInvitationCode: CourtesyInvitation = {
      congress: congressId,
      organization: organizationId,
      stripePromotionCode: strypePromotionCode,
      used: false,
   };

   const courtesyInvitationCreated = await createCourtesyInvitationRecord(newCourtesyInvitationCode);

   return courtesyInvitationCreated;
}

export async function createSingleCourtesyInvitationAndSendEmail({
   email,
   recipientName,
}: {
   email: string;
   recipientName?: string;
}) {
   const organization = await getOrganizationFromSubdomain();
   const congress = await getLatestCongress();

   const courtesyInvitation = await createCourtesyInvitationCode(congress.id, organization.id);

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

export async function getCourtesyInvitationByStryipePromoCode(stripePromotionCode: string) {
   const filter = pbFilter(`stripePromotionCode = {:stripePromotionCode}`, {
      stripePromotionCode,
   });
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
   const courtesyInvitation = await getCourtesyInvitationByStryipePromoCode(stripePromotionCode);
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
