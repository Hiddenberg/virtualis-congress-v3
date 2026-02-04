import Pocketbase from "pocketbase";

const NEXT_PUBLIC_POCKETBASE_URL = process.env.NEXT_PUBLIC_POCKETBASE_URL;

if (NEXT_PUBLIC_POCKETBASE_URL === undefined) {
   console.error("[pbClient] NEXT_PUBLIC_POCKETBASE_URL is not set");
   console.error("Values:", NEXT_PUBLIC_POCKETBASE_URL);
   throw new Error("NEXT_PUBLIC_POCKETBASE_URL is not set");
}

const pbClient = new Pocketbase(process.env.NEXT_PUBLIC_POCKETBASE_URL);

pbClient.autoCancellation(false);

export default pbClient;
