import Link from "next/link";
import { Button } from "@/components/global/Buttons";
import { getOrganizationStripeCredentials } from "@/features/organizationPayments/services/organizationStripeCredentialsServices";

export default async function AdminProductsLayout({ children }: { children: React.ReactNode }) {
   const organizationStripeCredentials = await getOrganizationStripeCredentials();

   if (!organizationStripeCredentials) {
      return (
         <div>
            <h1>No se han configurado las credenciales de Stripe</h1>
            <p>Por favor, configura las credenciales de Stripe para poder acceder a esta sección.</p>
            <Link href="/congress-admin/stripe-credentials">
               <Button>Configurar credenciales</Button>
            </Link>
         </div>
      );
   }

   return children;
}
