import { getOrganizationFromSubdomain } from "@/features/organizations/services/organizationServices";
import "server-only";
import { createDBRecord } from "@/libs/pbServerClientNew";
import type {
   CongressProductPriceCredentialUploaded,
   NewCongressProductPriceCredentialUploadedData,
} from "../types/congressProductPriceCredentialsUploadedTypes";

export async function createCongressProductPriceCredentialUploadedRecord(
   newCongressProductPriceCredentialUploadedData: NewCongressProductPriceCredentialUploadedData,
) {
   const organization = await getOrganizationFromSubdomain();

   const credentialFile = newCongressProductPriceCredentialUploadedData.credentialFile;

   // Check if the credential file is a file
   if (!(credentialFile instanceof File)) {
      throw new Error("Credential file is not a file");
   }

   const newCongressProductPriceCredentialUploaded = await createDBRecord<CongressProductPriceCredentialUploaded>(
      "CONGRESS_PRODUCT_PRICE_CREDENTIAL_UPLOADEDS",
      {
         ...newCongressProductPriceCredentialUploadedData,
         organization: organization.id,
      },
   );

   return newCongressProductPriceCredentialUploaded;
}
