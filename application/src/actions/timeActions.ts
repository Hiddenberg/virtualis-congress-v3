"use server";

export async function getServerTime() {
   const now = new Date();
   console.log(`Server Time (UTC): ${now.toISOString()}`);
   console.log(`Server Time (Local): ${now.toString()}`);
   console.log(
      `Server Timezone Offset: ${now.getTimezoneOffset() / -60} hours from UTC`,
   );
   return now.toISOString();
}
