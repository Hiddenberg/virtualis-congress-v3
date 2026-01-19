import { sendNotificationEmail } from "@/services/emailServices";

export async function GET() {
   await sendNotificationEmail(
      "ACP México",
      "vpazaran25@gmail.com",
      "Prueba de email",
      "Esto es un email de prueba",
   );

   return new Response("Email enviado");
}
