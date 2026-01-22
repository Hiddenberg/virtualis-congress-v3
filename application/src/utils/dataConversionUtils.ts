import { addDay, diffDays, format } from "@formkit/tempo";
import type { RecordModel } from "pocketbase";

export function getAccumulatedGainsPerDay(allPayments: (UserPayment & RecordModel)[]) {
   const initialDate = format({
      date: addDay(allPayments[0].created, -1),
      format: "YYYY-MM-DD",
      locale: "es-MX",
      tz: "America/Mexico_City",
   });
   const finalDate = format({
      date: new Date(),
      format: "YYYY-MM-DD",
      locale: "es-MX",
      tz: "America/Mexico_City",
   });
   const daysBetween = diffDays(finalDate, initialDate, "ceil") + 1;
   const datesBetween = Array.from(Array(daysBetween).keys()).map((i) =>
      format({
         date: addDay(initialDate, i),
         format: "YYYY-MM-DD",
         locale: "es-MX",
         tz: "America/Mexico_City",
      }),
   );

   const accumulatedGainsPerDay = datesBetween.reduce(
      (prev, currDate) => {
         const paymentsForDate = allPayments.filter(
            (payment) =>
               format({
                  date: payment.created,
                  format: "YYYY-MM-DD",
                  locale: "es-MX",
                  tz: "America/Mexico_City",
               }) === currDate,
         );

         const accumulatedGainsForDate =
            paymentsForDate.length === 0
               ? 0
               : paymentsForDate.reduce((prev, currPayment) => {
                    const paymentAmount = currPayment.totalAmount === 0 ? 0 : (currPayment.totalAmount ?? 0 / 100);
                    return prev + paymentAmount;
                 }, 0);

         if (prev.length === 0) {
            prev.push({
               date: currDate,
               accumulatedGains: accumulatedGainsForDate,
            });
         } else {
            prev.push({
               date: currDate,
               accumulatedGains: prev[prev.length - 1].accumulatedGains + accumulatedGainsForDate,
            });
         }

         return prev;
      },
      [] as { date: string; accumulatedGains: number }[],
   );

   return accumulatedGainsPerDay;
}

export interface NewRegistrationsData {
   date: string;
   newRegistrations: number;
}
export function getNewRegistrationsPerDay(allAttendantsRegistered: (AttendantData & RecordModel)[]) {
   const registrationsPerDay = allAttendantsRegistered.reduce((prev, curr) => {
      const formattedCreationDate = format({
         date: curr.created,
         format: "YYYY-MM-DD",
         locale: "es-MX",
         tz: "America/Mexico_City",
      });
      const existingDate = prev.find((item) => item.date === formattedCreationDate);
      if (existingDate) {
         existingDate.newRegistrations += 1;
      } else {
         prev.push({
            date: formattedCreationDate,
            newRegistrations: 1,
         });
      }

      return prev;
   }, [] as NewRegistrationsData[]);

   return registrationsPerDay;
}

export function getPaymentsCollected(
   attendatsWithPaymentConfirmedData: (AttendantData & RecordModel & { expand: { user: User & RecordModel } })[],
   allPayments: (UserPayment & RecordModel)[],
) {
   const usersWithPayments = attendatsWithPaymentConfirmedData.map((attendantData) => {
      const attendantPayment = allPayments.find((attendantPayment) => attendantPayment.user === attendantData.user);
      if (!attendantPayment) {
         return null;
      }

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-expect-error
      const additionalData: ACPAdditionalData = attendantData.additionalData;

      return {
         isACPMember: !!additionalData.acpId,
         amountPaid: attendantPayment.totalAmount === 0 ? 0 : (attendantPayment.totalAmount ?? 0 / 100),
         studiesGrade: additionalData.studiesGrade,
         name: attendantData.expand.user.name,
         date: format({
            date: attendantPayment.created,
            format: "YYYY-MM-DD",
            locale: "es-MX",
            tz: "America/Mexico_City",
         }),
      };
   });

   return usersWithPayments;
}
