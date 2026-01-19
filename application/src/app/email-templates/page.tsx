import { redirect } from "next/navigation";

export default function EmailTemplates() {
   return redirect(`/email-templates/account-created`);
}
