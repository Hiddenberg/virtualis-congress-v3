import { IPinfoWrapper } from "node-ipinfo";

const IP_INFO_TOKEN = process.env.IP_INFO_TOKEN;

if (!IP_INFO_TOKEN) {
   throw new Error("No se encontró el token de IPInfo");
}

const ipInfo = new IPinfoWrapper(IP_INFO_TOKEN);

export default ipInfo;
