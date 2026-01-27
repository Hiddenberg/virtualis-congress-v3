import "server-only";
// import { getOnlineCongressProductPrices } from "@/features/congresses/services/congressProductPricesServices";
// import { getOnlineCongressProduct } from "@/features/congresses/services/congressProductsServices";
// import {
//    getCongressRegistrationByUserId,
//    registerUserToLatestCongress,
//    updateCongressRegistration,
// } from "@/features/congresses/services/congressRegistrationServices";
import { getLatestCongress } from "@/features/congresses/services/congressServices";
// import { sendPaymentConfirmationEmail } from "@/features/emails/services/emailSendingServices";
import { confirmUserCongressPayment } from "@/features/organizationPayments/services/organizationPaymentsServices";
import {
   checkIfUserHasAccessToRecordings,
   // createUserPurchaseRecord,
} from "@/features/organizationPayments/services/userPurchaseServices";
import { getOrganizationFromSubdomain } from "@/features/organizations/services/organizationServices";
import type { UserRecord } from "@/features/users/types/userTypes";
import {
   //  createDBRecord,
   getFullDBRecordsList,
   pbFilter,
   // updateDBRecord,
} from "@/libs/pbServerClientNew";

interface ManualPaymentInput {
   userId: UserRecord["id"];
   modality?: "in-person" | "virtual";
   grantRecordingsAccess?: boolean;
   totalAmount: number;
   discount?: number;
   currency?: string;
}

// function generateManualPaymentId(userId: string) {
//    const rand = Math.random().toString(36).slice(2, 8);
//    return `manual:${userId}:${Date.now()}:${rand}`;
// }

export async function fulfillManualCongressRegistration(params: ManualPaymentInput) {
   if (!params.modality) {
      throw new Error("Debes seleccionar una modalidad de asistencia");
   }
   // const organization = await getOrganizationFromSubdomain();
   const congress = await getLatestCongress();

   if (!congress) {
      throw new Error("[ManualRegistration] No se encontró el congreso activo");
   }

   // Prevent modifying main purchase if already paid, but allow adding recordings if missing
   const alreadyPaid = await confirmUserCongressPayment(params.userId);
   const hasRecordingsAlready = await checkIfUserHasAccessToRecordings(params.userId, congress.id);
   if (alreadyPaid) {
      if (!params.grantRecordingsAccess) {
         throw new Error("El usuario ya cuenta con un pago confirmado para el congreso");
      }
      if (hasRecordingsAlready) {
         throw new Error("El usuario ya cuenta con acceso a las grabaciones");
      }
   }

   throw new Error("PENDING NEW IMPLEMENTATION");

   // Ensure the user has a congress registration
   // let registration = await getCongressRegistrationByUserId(params.userId);
   // if (!registration) {
   //    registration = await registerUserToLatestCongress(params.userId);
   // }

   // // Create the manual user payment record (mirrors USER_PAYMENTS schema)
   // const userPayment = await createDBRecord<UserPayment>("USER_PAYMENTS", {
   //    organization: organization.id,
   //    user: params.userId,
   //    stripeCheckoutSessionId: generateManualPaymentId(params.userId),
   //    checkoutSessionStatus: "complete",
   //    fulfilledSuccessfully: false,
   //    currency: params.currency ?? "mxn",
   //    totalAmount: params.totalAmount,
   //    discount: params.discount ?? 0,
   //    paymentMethod: "cash",
   // });

   // // Create purchases according to selection
   // if (!alreadyPaid) {
   //    if (params.modality === "virtual") {
   //       const virtualProduct = await getOnlineCongressProduct();
   //       if (!virtualProduct) {
   //          throw new Error("[ManualRegistration] Virtual product not found");
   //       }
   //       const prices = await getOnlineCongressProductPrices();
   //       if (prices.length === 0) {
   //          throw new Error("[ManualRegistration] Price not found");
   //       }
   //       await createUserPurchaseRecord({
   //          user: params.userId,
   //          congress: congress.id,
   //          product: virtualProduct.id,
   //          price: prices[0].id,
   //       });
   //       await updateCongressRegistration(registration.id, {
   //          attendanceModality: "virtual",
   //       });
   //    } else if (params.modality === "in-person") {
   //       await createUserPurchaseRecord({
   //          userId: params.userId,
   //          congressId: congress.id,
   //          productType: "in-person_congress",
   //       });
   //       await updateCongressRegistration(registration.id, {
   //          attendanceModality: "in-person",
   //       });
   //    }
   // }

   // if (params.grantRecordingsAccess) {
   //    await createUserPurchaseRecord({
   //       userId: params.userId,
   //       congressId: congress.id,
   //       productType: "recordings_access",
   //    });
   //    await updateCongressRegistration(registration.id, {
   //       hasAccessToRecordings: true,
   //    });
   // }

   // if (!alreadyPaid) {
   //    await updateCongressRegistration(registration.id, {
   //       paymentConfirmed: true,
   //       payment: userPayment.id,
   //    });
   // }

   // await updateDBRecord<UserPayment>("USER_PAYMENTS", userPayment.id, {
   //    fulfilledSuccessfully: true,
   //    fulfilledAt: new Date().toISOString(),
   // });

   // await sendPaymentConfirmationEmail(params.userId);

   // return {
   //    userPaymentId: userPayment.id,
   // };
}

export async function searchUsersRegisteredToCurrentCongress(query: string) {
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

   const registrations = await getFullDBRecordsList<{
      user: UserRecord["id"];
      expand: { user: UserRecord };
   }>("CONGRESS_REGISTRATIONS", {
      filter,
      expand: "user",
   });

   const normalizedQuery = query.trim().toLowerCase();
   const users = registrations
      .map((r) => r.expand.user)
      .filter((u) => {
         if (!normalizedQuery) return true;
         const name = u.name?.toLowerCase() ?? "";
         const email = u.email?.toLowerCase() ?? "";
         return name.includes(normalizedQuery) || email.includes(normalizedQuery);
      });

   // Decorate with payment status; limit to 25 to keep checks reasonable
   const limitedUsers = users.slice(0, 25);
   const results: Array<{
      user: UserRecord;
      hasPaid: boolean;
      hasRecordings: boolean;
   }> = [];
   for (const u of limitedUsers) {
      const hasPaid = await confirmUserCongressPayment(u.id);
      const hasRecordings = await checkIfUserHasAccessToRecordings(u.id, congress.id);
      results.push({
         user: u,
         hasPaid,
         hasRecordings,
      });
   }

   return results;
}
