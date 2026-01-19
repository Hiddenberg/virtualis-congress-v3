import "server-only";
import { KJUR } from "jsrsasign";

export async function getZoomSignature(
   sessionName: string,
   userIdentity: string,
   sessionKey: string,
   role: number,
) {
   if (!process.env.ZOOM_SDK_KEY || !process.env.ZOOM_SDK_SECRET) {
      throw new Error("Missing Zoom SDK credentials");
   }

   const issuedAt = Math.round(new Date().getTime() / 1000) - 30;
   const exp = issuedAt + 60 * 60 * 2;
   const tokenHeader = {
      alg: "HS256",
      typ: "JWT",
   };
   const sdkKey = process.env.ZOOM_SDK_KEY;
   const sdkSecret = process.env.ZOOM_SDK_SECRET;
   const tokenPayload = {
      app_key: sdkKey,
      tpc: sessionName,
      role_type: role,
      version: 1,
      iat: issuedAt,
      exp: exp,
      user_identity: userIdentity,
      session_key: sessionKey,
   };
   const sHeader = JSON.stringify(tokenHeader);
   const sPayload = JSON.stringify(tokenPayload);
   const sdkJWT = KJUR.jws.JWS.sign("HS256", sHeader, sPayload, sdkSecret);
   return sdkJWT;
}
