import { decodeJwt, jwtVerify, SignJWT } from "jose";
import { getSingleDBRecord, pbFilter } from "@/libs/pbServerClientNew";

const { JWT_ACCESS_SECRET } = process.env;
const { JWT_REFRESH_SECRET } = process.env;

if (!JWT_ACCESS_SECRET || !JWT_REFRESH_SECRET) {
   throw new Error("JWT_ACCESS_SECRET or JWT_REFRESH_SECRET is not set");
}

interface JWTUserPayload {
   userId: string;
}
export async function generateUserAuthToken(userId: string) {
   const token = await new SignJWT({
      userId,
   })
      .setProtectedHeader({
         alg: "HS256",
      })
      .setIssuedAt()
      .setExpirationTime("15m")
      .sign(new TextEncoder().encode(JWT_ACCESS_SECRET as string));

   return token;
}

interface JWTRefreshPayload {
   userId: string;
}
export async function generateRefreshToken(userId: string) {
   const payload = {
      userId,
   };

   const token = await new SignJWT(payload)
      .setProtectedHeader({
         alg: "HS256",
      })
      .setIssuedAt()
      .setExpirationTime("1yr")
      .sign(new TextEncoder().encode(JWT_REFRESH_SECRET as string));

   return token;
}

export async function verifyRefreshToken(refreshToken: string) {
   try {
      await jwtVerify(
         refreshToken,
         new TextEncoder().encode(JWT_REFRESH_SECRET as string),
      );

      const filter = pbFilter("token = {:token}", {
         token: refreshToken,
      });

      const storedRefreshToken = await getSingleDBRecord(
         "USER_REFRESH_TOKENS",
         filter,
      );

      if (!storedRefreshToken) {
         return false;
      }

      return true;
   } catch {
      console.error("[verifyRefreshToken] Refresh token is invalid");
      return false;
   }
}

export async function verifyUserAuthToken(authToken: string) {
   try {
      await jwtVerify(
         authToken,
         new TextEncoder().encode(JWT_ACCESS_SECRET as string),
      );
      return true;
   } catch {
      console.error("[verifyUserAuthToken] User auth token is invalid");
      return false;
   }
}

export function getUserIdFromAuthToken(authToken: string) {
   const decoded = decodeJwt(authToken) as unknown as JWTUserPayload;
   return decoded.userId;
}

export function getUserIdFromRefreshToken(refreshToken: string) {
   const decoded = decodeJwt(refreshToken) as unknown as JWTRefreshPayload;
   return decoded.userId;
}
