"use server";

import { revalidatePath } from "next/cache";
import {
   getCongressProductPriceById,
   getInPersonCongressProductPrices,
   getOnlineCongressProductPrices,
   getRecordingsCongressProductPrices,
} from "@/features/congresses/services/congressProductPricesServices";
import { getCongressRegistrationByUserId } from "@/features/congresses/services/congressRegistrationServices";
import { getLatestCongress } from "@/features/congresses/services/congressServices";
import type { ProductPriceRecord } from "@/features/congresses/types/congressProductPricesTypes";
import type { CongressProductRecord } from "@/features/congresses/types/congressProductsTypes";
import type { CongressRegistration } from "@/features/congresses/types/congressRegistrationTypes";
import {
   sendPaymentConfirmationEmail,
   sendPlatformRegistrationConfirmationEmail,
} from "@/features/emails/services/emailSendingServices";
import { confirmUserCongressPayment } from "@/features/organizationPayments/services/organizationPaymentsServices";
import { checkIfUserHasAccessToRecordings } from "@/features/organizationPayments/services/userPurchaseServices";
import type { UserPurchase } from "@/features/organizationPayments/types/userPurchasesTypes";
import { getOrganizationFromSubdomain } from "@/features/organizations/services/organizationServices";
import { generateRandomId } from "@/features/staggeredAuth/utils/passwordsGenerator";
import { checkIfUserExists, getUserById } from "@/features/users/services/userServices";
import type { User, UserRecord } from "@/features/users/types/userTypes";
import { dbBatch } from "@/libs/pbServerClientNew";
import PB_COLLECTIONS from "@/types/constants/pocketbaseCollections";
import {
   // fulfillManualCongressRegistration,
   searchUsersRegisteredToCurrentCongress,
} from "../services/manualRegistrationServices";

export async function searchRegisteredUsersAction(query: string): Promise<
   BackendResponse<{
      users: Array<{
         user: UserRecord;
         hasPaid: boolean;
         hasRecordings: boolean;
      }>;
   }>
> {
   try {
      const users = await searchUsersRegisteredToCurrentCongress(query);
      return {
         success: true,
         data: {
            users,
         },
      };
   } catch (error) {
      if (error instanceof Error) {
         return {
            success: false,
            errorMessage: error.message,
         };
      }
      return {
         success: false,
         errorMessage: "Error desconocido",
      };
   }
}

export interface ManualPaymentFormData {
   userId: string;
   modality: "in-person" | "virtual" | "";
   grantRecordingsAccess?: boolean;
   totalAmount: number;
   discount?: number;
   currency: string;
   productPriceId?: string;
   isCustomPrice?: boolean;
}

export async function registerManualPaymentAction(form: ManualPaymentFormData): Promise<BackendResponse<null>> {
   try {
      const congress = await getLatestCongress();
      const recordingsPrices = await getRecordingsCongressProductPrices();
      if (recordingsPrices.length === 0) {
         return {
            success: false,
            errorMessage: "Precio de grabaciones no encontrado",
         };
      }
      const recordingsPrice = recordingsPrices[0];

      // Check if the user is already registered to the congress
      const userRegistration = await getCongressRegistrationByUserId(form.userId);
      const organization = await getOrganizationFromSubdomain();
      const user = await getUserById(form.userId);

      if (!userRegistration) {
         return {
            success: false,
            errorMessage: "El usuario no está registrado al congreso",
         };
      }
      if (!user) {
         return {
            success: false,
            errorMessage: "Usuario no encontrado",
         };
      }

      // Check if the user has already paid for the congress
      const userHasPaid = await confirmUserCongressPayment(form.userId);
      if (userHasPaid) {
         if (form.grantRecordingsAccess) {
            // Check if the user has already access to the recordings
            const userHasAccessToRecordings = await checkIfUserHasAccessToRecordings(form.userId, congress.id);
            if (userHasAccessToRecordings) {
               return {
                  success: false,
                  errorMessage:
                     "El usuario ya tiene acceso a las grabaciones, por favor actualice la página para ver los cambios",
               };
            }

            // Create user purchase record for recordings access
            const recordingsOnlyBatch = dbBatch();

            // Create user purchase record for recordings access
            recordingsOnlyBatch.collection(PB_COLLECTIONS.USER_PURCHASES).create({
               id: generateRandomId(),
               organization: organization.id,
               user: form.userId,
               congress: congress.id,
               product: recordingsPrice.product,
               price: recordingsPrice.id,
            } satisfies UserPurchase & { id: string });

            // Update congress registration
            recordingsOnlyBatch.collection(PB_COLLECTIONS.CONGRESS_REGISTRATIONS).update(userRegistration.id, {
               hasAccessToRecordings: true,
            } satisfies Partial<CongressRegistration>);

            // Create user payment record
            recordingsOnlyBatch.collection(PB_COLLECTIONS.USER_PAYMENTS).create({
               id: generateRandomId(),
               organization: organization.id,
               user: form.userId,
               wasCustomPrice: form.isCustomPrice,
               checkoutSessionStatus: "complete",
               fulfilledSuccessfully: true,
               stripeCheckoutSessionId: "manual-payment",
               currency: recordingsPrice.currency,
               totalAmount: recordingsPrice.priceAmount,
               discount: form.discount ?? 0,
               paymentMethod: "cash",
               fulfilledAt: new Date().toISOString(),
            } satisfies UserPayment & { id: string });

            await recordingsOnlyBatch.send();

            revalidatePath("/manual-registration", "page");

            return {
               success: true,
               data: null,
               successMessage: "Se ha brindado acceso a las grabaciones al usuario exitosamente",
            };
         }
         return {
            success: false,
            errorMessage: "El usuario ya ha pagado para el congreso, por favor actualice la página para ver los cambios",
         };
      }

      if (form.grantRecordingsAccess) {
         // Check if the user has already access to the recordings
         const userHasAccessToRecordings = await checkIfUserHasAccessToRecordings(form.userId, congress.id);
         if (userHasAccessToRecordings) {
            return {
               success: false,
               errorMessage: "El usuario ya tiene acceso a las grabaciones",
            };
         }
      }

      if (form.modality === "") {
         return {
            success: false,
            errorMessage: "Debes seleccionar una modalidad de asistencia",
         };
      }

      // Create user purchase record for the selected modality
      const batch = dbBatch();

      async function getProductId(): Promise<CongressProductRecord["id"]> {
         if (form.isCustomPrice) {
            if (form.modality === "virtual") {
               const onlineProductPrices = await getOnlineCongressProductPrices();
               if (onlineProductPrices.length === 0) {
                  throw new Error("Online product price not found");
               }
               return onlineProductPrices[0].product;
            } else if (form.modality === "in-person") {
               const inPersonProductPrices = await getInPersonCongressProductPrices();
               if (inPersonProductPrices.length === 0) {
                  throw new Error("In-person product price not found");
               }
               return inPersonProductPrices[0].product;
            }
         }

         if (!form.productPriceId) {
            throw new Error("Product price ID not found");
         }
         const price = await getCongressProductPriceById(form.productPriceId);

         if (!price) {
            throw new Error("Price not found");
         }

         return price.product;
      }

      async function getPriceId(): Promise<ProductPriceRecord["id"]> {
         if (form.isCustomPrice) {
            if (form.modality === "virtual") {
               const onlineProductPrices = await getOnlineCongressProductPrices();
               if (onlineProductPrices.length === 0) {
                  throw new Error("Online product price not found");
               }
               return onlineProductPrices[0].id;
            } else if (form.modality === "in-person") {
               const inPersonProductPrices = await getInPersonCongressProductPrices();
               if (inPersonProductPrices.length === 0) {
                  throw new Error("In-person product price not found");
               }
               return inPersonProductPrices[0].id;
            }
         }

         if (!form.productPriceId) {
            throw new Error("Product price ID not found");
         }

         const price = await getCongressProductPriceById(form.productPriceId);
         if (!price) {
            throw new Error("Price not found");
         }

         return price.id;
      }

      // Create user purchase record for the selected modality
      batch.collection(PB_COLLECTIONS.USER_PURCHASES).create({
         id: generateRandomId(),
         organization: organization.id,
         user: form.userId,
         congress: congress.id,
         product: await getProductId(),
         price: await getPriceId(),
         wasCustomPrice: form.isCustomPrice,
      } satisfies UserPurchase & { id: string });

      if (form.grantRecordingsAccess) {
         // Create user purchase record for recordings access
         batch.collection(PB_COLLECTIONS.USER_PURCHASES).create({
            id: generateRandomId(),
            organization: organization.id,
            user: form.userId,
            congress: congress.id,
            product: recordingsPrice.product,
            price: recordingsPrice.id,
            wasCustomPrice: form.isCustomPrice,
         } satisfies UserPurchase & { id: string });
      }

      // Create user payment record
      batch.collection(PB_COLLECTIONS.USER_PAYMENTS).create({
         id: generateRandomId(),
         organization: organization.id,
         user: form.userId,
         checkoutSessionStatus: "complete",
         fulfilledSuccessfully: true,
         stripeCheckoutSessionId: "manual-payment",
         currency: form.currency,
         totalAmount: form.totalAmount,
         discount: form.discount ?? 0,
         paymentMethod: "cash",
         fulfilledAt: new Date().toISOString(),
         wasCustomPrice: form.isCustomPrice,
      } satisfies UserPayment & { id: string });

      await batch.send();
      await sendPaymentConfirmationEmail(user.id);

      revalidatePath("/manual-registration", "page");

      const successMessage = form.grantRecordingsAccess
         ? "Se ha brindado acceso a las grabaciones al usuario exitosamente"
         : "Se ha registrado el pago al usuario exitosamente";

      return {
         success: true,
         data: null,
         successMessage: successMessage,
      };
   } catch (error) {
      if (error instanceof Error) {
         return {
            success: false,
            errorMessage: error.message,
         };
      }
      return {
         success: false,
         errorMessage: "Error desconocido",
      };
   }
}

export interface StaffNewUserFormData {
   name: string;
   email: string;
   phoneNumber?: string;
   dateOfBirth?: string;
   additionalEmail1?: string;
   additionalEmail2?: string;
}

export async function staffCreateAttendantUserAction(form: StaffNewUserFormData): Promise<BackendResponse<null>> {
   try {
      const exists = await checkIfUserExists(form.email);
      if (exists) {
         return {
            success: false,
            errorMessage: "Este correo ya está registrado en la plataforma",
         };
      }

      if (form.additionalEmail1) {
         const additionalEmail1Exists = await checkIfUserExists(form.additionalEmail1);
         if (additionalEmail1Exists) {
            return {
               success: false,
               errorMessage: `Este correo adicional ${form.additionalEmail1} ya está registrado en la plataforma`,
            };
         }
      }

      if (form.additionalEmail2) {
         const additionalEmail2Exists = await checkIfUserExists(form.additionalEmail2);
         if (additionalEmail2Exists) {
            return {
               success: false,
               errorMessage: `Este correo adicional ${form.additionalEmail2} ya está registrado en la plataforma`,
            };
         }
      }

      const organization = await getOrganizationFromSubdomain();
      const congress = await getLatestCongress();
      const batch = dbBatch();

      const normalizedEmail = form.email.toLowerCase().trim();
      const normalizedAdditionalEmail1 = form.additionalEmail1?.toLowerCase().trim();
      const normalizedAdditionalEmail2 = form.additionalEmail2?.toLowerCase().trim();

      const newUserId = generateRandomId();
      batch.collection(PB_COLLECTIONS.USERS).create({
         id: newUserId,
         organization: organization.id,
         name: form.name,
         email: normalizedEmail,
         phoneNumber: form.phoneNumber,
         dateOfBirth: form.dateOfBirth,
         additionalEmail1: normalizedAdditionalEmail1,
         additionalEmail2: normalizedAdditionalEmail2,
         role: "attendant",
      } satisfies User & { id: string });

      // Register the user to the congress
      const userRegistrationId = generateRandomId();
      batch.collection(PB_COLLECTIONS.CONGRESS_REGISTRATIONS).create({
         id: userRegistrationId,
         organization: organization.id,
         user: newUserId,
         congress: congress.id,
         hasAccessToRecordings: false,
         paymentConfirmed: false,
         registrationType: "regular",
      } satisfies CongressRegistration & { id: string });

      await batch.send();

      await sendPlatformRegistrationConfirmationEmail(newUserId);

      revalidatePath("/manual-registration");

      return {
         success: true,
         data: null,
      };
   } catch (error) {
      if (error instanceof Error) {
         return {
            success: false,
            errorMessage: error.message,
         };
      }
      return {
         success: false,
         errorMessage: "Ocurrió un error al crear el usuario",
      };
   }
}

export async function refreshCongressUserRegistrationDetailsAction(): Promise<BackendResponse<null>> {
   try {
      revalidatePath("/manual-registration", "page");
      return {
         success: true,
         data: null,
      };
   } catch (error) {
      if (error instanceof Error) {
         return {
            success: false,
            errorMessage: error.message,
         };
      }
      return {
         success: false,
         errorMessage: "Error desconocido",
      };
   }
}
