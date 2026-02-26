export const IS_DEV_ENVIRONMENT = process.env.NODE_ENV === "development";
export const PLATFORM_BASE_DOMAIN = IS_DEV_ENVIRONMENT ? "localhost:3000" : "virtualis.app";

export const COURTESY_STRIPE_COUPON_ID = "courtesy-invitation-coupon";
