import { UserManager, WebStorageStateStore } from "oidc-client-ts";

const clientId = import.meta.env.VITE_COGNITO_CLIENT_ID;
const domain = import.meta.env.VITE_COGNITO_DOMAIN;
const origin = window.location.origin;
const store = new WebStorageStateStore({ store: window.sessionStorage });

export const auth = new UserManager({
  authority: import.meta.env.VITE_COGNITO_ISSUER,
  client_id: clientId,
  redirect_uri: `${origin}/auth/callback`,
  response_type: "code",
  scope: "openid pasteleria-api/read pasteleria-api/write",
  stateStore: store,
  userStore: store,
  automaticSilentRenew: false,
  loadUserInfo: false,
});

export async function signOut() {
  await auth.removeUser();
  const url = new URL("/logout", domain);
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("logout_uri", `${origin}/login`);
  window.location.assign(url.toString());
}
