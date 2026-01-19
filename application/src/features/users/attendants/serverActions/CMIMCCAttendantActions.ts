"use server";

import { getLoggedInUserId } from "@/features/staggeredAuth/services/staggeredAuthServices";
import type { MedicalRole } from "../components/attendantDataForms/CMIMCCAttendantDataForm";
import { createAttendantData } from "../services/attendantServices";

interface CMIMCCAttendantData {
   medicalRole: MedicalRole["title"];
}

export async function submitCMIMCCAttendantDataAction({
   medicalRole,
}: CMIMCCAttendantData): Promise<BackendResponse<AttendantData>> {
   try {
      const userId = await getLoggedInUserId();

      if (!userId) {
         return {
            success: false,
            errorMessage: "User not found",
         };
      }

      const attendantData = await createAttendantData({
         userId,
         additionalData: {
            medicalRole,
         },
      });

      return {
         success: true,
         data: attendantData,
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
         errorMessage: "An unknown error occurred",
      };
   }
}
