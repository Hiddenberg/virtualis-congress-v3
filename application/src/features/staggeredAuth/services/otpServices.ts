import { createHash } from "crypto";
import { createDBRecord, deleteDBRecord, getDBRecordById, getFullDBRecordsList } from "@/libs/pbServerClientNew";
import { generateRandomOTPCode } from "../utils/passwordsGenerator";

const OTP_CODE_EXPIRATION_TIME = 900000; // 15 minutes

export async function deleteOTPCode(otpCodeId: string) {
   try {
      const otpCodeRecord = await getDBRecordById<OTPCodeRecord>("OTP_CODES", otpCodeId);
      if (!otpCodeRecord) {
         console.log("[deleteOTPCode] OTP code already deleted", otpCodeId);
         return;
      }

      console.log("[deleteOTPCode] Deleting OTP code", otpCodeId);
      await deleteDBRecord("OTP_CODES", otpCodeId);
   } catch (error) {
      console.error("[deleteOTPCode] Error deleting OTP code", error);
   }
}

export async function generateOTPCode(userId: string) {
   const otpCode = generateRandomOTPCode(8);
   const otpCodeHash = createHash("sha256").update(otpCode).digest("hex");

   const createdOTPRecord = await createDBRecord<OTPCode>("OTP_CODES", {
      user: userId,
      otpCode: otpCodeHash,
   });

   // Automatically delete the OTP code after 15 minutes
   setTimeout(async () => deleteOTPCode(createdOTPRecord.id), OTP_CODE_EXPIRATION_TIME);
   return otpCode;
}

export async function getOTPCodesForUser(userId: string) {
   const otpCodeRecord = await getFullDBRecordsList<OTPCodeRecord>("OTP_CODES", {
      filter: `user = "${userId}"`,
   });
   return otpCodeRecord;
}

export async function verifyOTPCode(userId: string, otpCode: string) {
   const otpCodeRecords = await getOTPCodesForUser(userId);
   if (otpCodeRecords.length === 0) {
      console.log("[verifyOTPCode] No OTP codes found for user", userId);
      return false;
   }

   const validCode = otpCodeRecords.some((otpCodeRecord) => {
      const isExpired = new Date(otpCodeRecord.created).getTime() + OTP_CODE_EXPIRATION_TIME < Date.now();

      const otpCodeHash = createHash("sha256").update(otpCode).digest("hex");
      return otpCodeHash === otpCodeRecord.otpCode && !isExpired;
   });

   return validCode;
}

export async function deleteAllUserOTPCodes(userId: string) {
   const otpCodeRecords = await getFullDBRecordsList<OTPCodeRecord>("OTP_CODES", {
      filter: `user = "${userId}"`,
   });

   if (otpCodeRecords.length === 0) return;

   await Promise.all(
      otpCodeRecords.map(async (otpCodeRecord) => {
         await deleteOTPCode(otpCodeRecord.id);
      }),
   );
}
