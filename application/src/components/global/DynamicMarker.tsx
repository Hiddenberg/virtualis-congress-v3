import { connection } from "next/server";
import { Suspense } from "react";

export default function DynamicMarker() {
   const Connection = async () => {
      await connection();
      return null;
   };
   return (
      <Suspense>
         <Connection />
      </Suspense>
   );
}
