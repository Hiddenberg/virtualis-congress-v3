import "server-only";
import { addDay, date, diffDays } from "@formkit/tempo";
import { ClientResponseError, type RecordModel } from "pocketbase";
import { cache } from "react";
import { getOrganizationFromSubdomain } from "@/features/organizations/services/organizationServices";
import pbServerClient from "@/libs/pbServerClient";
import { getSingleDBRecord, pbFilter } from "@/libs/pbServerClientNew";
import PB_COLLECTIONS from "@/types/constants/pocketbaseCollections";
import { Congress } from "../types/congressTypes";

export async function getCongressById(congressId: string) {
   try {
      const congress = await pbServerClient
         .collection(PB_COLLECTIONS.CONGRESSES)
         .getOne<Congress & RecordModel>(congressId);
      return congress;
   } catch (error) {
      if (error instanceof ClientResponseError && error.status === 404) {
         return null;
      }
      throw error;
   }
}

export const getLatestCongress = cache(async () => {
   const organization = await getOrganizationFromSubdomain();

   const filter = pbFilter(
      `
      organization = {:organizationId}
   `,
      {
         organizationId: organization.id,
      },
   );
   const congress = await getSingleDBRecord<Congress>("CONGRESSES", filter, {
      sort: "-startDate",
   });

   if (!congress) {
      throw new Error(
         `[CongressServices] No congress found for organization ${organization.shortID}`,
      );
   }

   return congress;
});

export async function getCongressDates(congressId: string) {
   const congress = await getCongressById(congressId);

   if (!congress) {
      return [];
   }

   const startDate = congress.startDate;
   const endDate = congress.finishDate;

   const daysCount = diffDays(endDate, startDate, "ceil");

   const inBetweenDates = [];
   for (let i = 0; i < daysCount; i++) {
      if (i === 0) {
         inBetweenDates.push(date(startDate));
         continue;
      }

      const newNate = addDay(startDate, i);
      inBetweenDates.push(newNate);
   }

   return inBetweenDates;
}
