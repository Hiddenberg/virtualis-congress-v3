import { cookies } from "next/headers";
import "server-only";
import { NextResponse } from "next/server";
import { REFRESH_COOKIE_KEY } from "../constants/authConstants";
import { generateUserAuthToken, getUserIdFromRefreshToken, verifyRefreshToken } from "../services/jwtServices";
import { setAuthTokenCookie } from "../services/staggeredAuthServices";

export async function refreshAuthTokenEndpoint(): Promise<NextResponse<BackendResponse>> {
   const cookieStore = await cookies();
   const refreshToken = cookieStore.get(REFRESH_COOKIE_KEY)?.value;

   if (!refreshToken) {
      return NextResponse.json(
         {
            success: false,
            errorMessage: "No se encontró el token de refresco",
         },
         {
            status: 401,
         },
      );
   }

   const isRefreshTokenValid = await verifyRefreshToken(refreshToken);

   if (!isRefreshTokenValid) {
      return NextResponse.json(
         {
            success: false,
            errorMessage: "Token de refresco inválido",
         },
         {
            status: 401,
         },
      );
   }

   const userId = getUserIdFromRefreshToken(refreshToken);

   const newAuthToken = await generateUserAuthToken(userId);

   await setAuthTokenCookie(newAuthToken);

   return NextResponse.json({
      success: true,
      data: null,
   });
}
