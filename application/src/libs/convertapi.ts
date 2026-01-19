import "server-only";
import ConvertAPI from "convertapi";

const CONVERTAPI_API_KEY = process.env.CONVERTAPI_API_KEY;

if (!CONVERTAPI_API_KEY) {
   throw new Error("CONVERTAPI_API_KEY is not set");
}

const convertapi = new ConvertAPI(CONVERTAPI_API_KEY);

export default convertapi;
