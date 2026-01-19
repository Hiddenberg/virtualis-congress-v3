interface OTPCode {
   user: string;
   otpCode: string;
}
type OTPCodeRecord = OTPCode & DBRecord;

interface UserRefreshToken {
   user: string;
   token: string;
   ip?: string;
   userAgent?: string;
}
type UserRefreshTokenRecord = UserRefreshToken & DBRecord;

interface UserAuthData {
   authUser: User & DBRecord;
   refreshToken: string;
   authToken: string;
   userRole: RoleType;
}
