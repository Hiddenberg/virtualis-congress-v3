import Pocketbase from "pocketbase";

const pbClient = new Pocketbase(process.env.NEXT_PUBLIC_POCKETBASE_URL);

export default pbClient;
