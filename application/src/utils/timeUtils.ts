import { addMinute, dayStart, tzDate } from "@formkit/tempo";

export function get30MinIntervals(startTime: string, endTime: string) {
   const startDate = new Date(startTime);
   const endDate = new Date(endTime);

   const diffMs = endDate.getTime() - startDate.getTime();

   const intervals = Math.floor(diffMs / (1000 * 60 * 30));

   return intervals;
}

export function generateTimeSlots(currentDate: Date) {
   const slots = [];
   let startMinutes = 8 * 60; // 8:00 AM in minutes from midnight (8 * 60 = 480)
   const endMinutes = 16.5 * 60; // 4:30 PM in minutes from midnight (16.5 * 60 = 990)

   while (startMinutes < endMinutes) {
      const slotStart = addMinute(dayStart(currentDate), startMinutes); // "08:00 AM", etc.
      const slotEnd = addMinute(dayStart(currentDate), startMinutes + 30); // "08:30 AM", etc.

      slots.push({
         start: convertToMexicoCityTime(slotStart),
         end: convertToMexicoCityTime(slotEnd),
      });

      startMinutes += 30; // move forward by 30 minutes
   }

   return slots;
}

export function convertToMexicoCityTime(date: Date) {
   return tzDate(date, "America/Mexico_City");
}
