import "server-only";

import Pocketbase from "pocketbase";

if (!process.env.POCKETBASE_SERVER_URL) {
   throw new Error("[pbServerClient] POCKETBASE_SERVER_URL is not set");
}

if (!process.env.PB_SERVER_TOKEN) {
   throw new Error("[pbServerClient] PB_SERVER_TOKEN is not set");
}

const pbServerClient = new Pocketbase(process.env.POCKETBASE_SERVER_URL);

pbServerClient.autoCancellation(false);
pbServerClient.authStore.save(process.env.PB_SERVER_TOKEN);

export default pbServerClient;
