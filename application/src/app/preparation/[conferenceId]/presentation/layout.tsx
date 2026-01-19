import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { getLoggedInUserId } from "@/features/staggeredAuth/services/staggeredAuthServices";

export default async function PresentationPreparationLayout({
   children,
   params,
}: {
   children: ReactNode;
   params: Promise<{ conferenceId: string }>;
}) {
   const { conferenceId } = await params;

   const user = await getLoggedInUserId();

   if (!user) {
      return redirect(
         `/preparation/${conferenceId}/speaker-signup?redirectTo=/preparation/${conferenceId}/presentation/upload`,
      );
   }

   return children;
}
