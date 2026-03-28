export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

// Generate login URL at runtime so redirect URI reflects the current origin.
export const getLoginUrl = () => {
  const origin = window.location.origin || (window.location.protocol + "//" + window.location.host);
  const oauthPortalUrl = import.meta.env.VITE_OAUTH_PORTAL_URL || origin;
  const appId = import.meta.env.VITE_APP_ID || "zuodii-prod";
  const redirectUri = `${origin}/api/oauth/callback`;
  const state = btoa(redirectUri);

  try {
    // Ensure oauthPortalUrl is a valid base
    const base = oauthPortalUrl.endsWith("/") ? oauthPortalUrl : oauthPortalUrl + "/";
    const url = new URL("app-auth", base);
    url.searchParams.set("appId", appId);
    url.searchParams.set("redirectUri", redirectUri);
    url.searchParams.set("state", state);
    url.searchParams.set("type", "signIn");
    return url.toString();
  } catch (e) {
    console.error("Invalid login URL components:", { oauthPortalUrl, appId, origin });
    return "/login"; // Fallback to local login
  }
};


