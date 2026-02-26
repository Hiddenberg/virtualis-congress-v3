import { type NextRequest, NextResponse } from "next/server";
import {
   generateUserAuthToken,
   getUserIdFromRefreshToken,
   verifyRefreshToken,
   verifyUserAuthToken,
} from "@/features/staggeredAuth/services/jwtServices";

export async function proxy(request: NextRequest) {
   const authToken = request.cookies.get("auth_token")?.value;
   const refreshToken = request.cookies.get("refresh_token")?.value;
   const currentPath = request.nextUrl.pathname;

   const response = NextResponse.next();

   response.headers.set("x-current-path", currentPath);

   const isRefreshTokenValid = await verifyRefreshToken(refreshToken ?? "");
   if (!refreshToken || !isRefreshTokenValid) {
      return response;
   }

   const isAuthTokenValid = await verifyUserAuthToken(authToken ?? "");
   if (!authToken || !isAuthTokenValid) {
      console.log("[middleware] Auth token is invalid, generating new auth token");
      const userId = getUserIdFromRefreshToken(refreshToken);
      const newAuthToken = await generateUserAuthToken(userId);

      response.cookies.set("auth_token", newAuthToken, {
         httpOnly: true,
         secure: process.env.NODE_ENV === "production",
         maxAge: 60 * 15, // 15 minutes
         expires: new Date(Date.now() + 1000 * 60 * 15), // 15 minutes
         path: "/",
      });
   }

   return response;
}

export const config = {
   matcher: [
      /*
       * Match all request paths except for the ones starting with:
       * - api (API routes)
       * - _next/static (static files)
       * - _next/image (image optimization files)
       * - favicon.ico, sitemap.xml, robots.txt (metadata files)
       */
      "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
   ],
};
