import "server-only";
import { getLoggedInUserId } from "@/features/staggeredAuth/services/staggeredAuthServices";
import { getUserById } from "@/features/users/services/userServices";

/**
 * This function checks if the user is authorized to access the page or perform a server action
 * If the user is not authorized returns false
 * @param authorizedUserTypes
 * @returns {Promise<boolean>} true if the user is authorized, false otherwise
 */
export async function checkAuthorizedUserFromServer(
   authorizedUserTypes: User["role"][],
): Promise<boolean> {
   const userId = await getLoggedInUserId();
   if (!userId) {
      return false;
   }

   const user = await getUserById(userId);
   if (!user) {
      return false;
   }

   if (!authorizedUserTypes.includes(user.role)) {
      return false;
   }

   return true;
}
