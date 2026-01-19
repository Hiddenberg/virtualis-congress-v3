"use server";
import { getLoggedInUserId } from "@/features/staggeredAuth/services/staggeredAuthServices";
import { createOrUpdateAttendantData } from "../services/attendantServices";

export async function createAttendantAdditionalDataAction<T>({
   additionalData,
}: {
   additionalData: T;
}): Promise<BackendResponse<AttendantData>> {
   try {
      const userId = await getLoggedInUserId();

      if (!userId) {
         return {
            success: false,
            errorMessage: "User not found",
         };
      }

      const attendantData = await createOrUpdateAttendantData({
         userId: userId as UserRecord["id"],
         additionalData: additionalData as AdditionalData,
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
      console.error(
         "[createAttendantAdditionalDataAction] An unknown error occurred:",
         error,
      );

      return {
         success: false,
         errorMessage:
            "[createAttendantAdditionalDataAction] An unknown error occurred",
      };
   }
}
