const apiBase = (process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000').replace(/\/$/, '');
const verifierKey = 'chefu-admin-pkce-verifier';
const tokenKey = 'chefu-admin-access-token';
const stateKey = 'chefu-admin-oauth-state';

function base64Url(bytes: ArrayBuffer) {
  return btoa(String.fromCharCode(...new Uint8Array(bytes))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
export function getAccessToken() { return sessionStorage.getItem(tokenKey); }
export function clearAccessToken() { sessionStorage.removeItem(tokenKey); }
export async function beginSso() {
  const verifier = base64Url(crypto.getRandomValues(new Uint8Array(32)).buffer);
  const challenge = base64Url(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier)));
  sessionStorage.setItem(verifierKey, verifier);
  const state = crypto.randomUUID();
  sessionStorage.setItem(stateKey, state);
  const params = new URLSearchParams({ client_id: 'chefu-admin-web', redirect_uri: `${window.location.origin}/auth/callback`, response_type: 'code', scope: 'openid profile email admin:manage', code_challenge: challenge, code_challenge_method: 'S256', state });
  window.location.assign(`${apiBase}/oauth/authorize?${params}`);
}
export async function completeSso(code: string, state: string | null) {
  const verifier = sessionStorage.getItem(verifierKey);
  if (!verifier) throw new Error('Your sign-in session expired. Start again.');
  if (!state || state !== sessionStorage.getItem(stateKey)) throw new Error('Invalid SSO state. Start again.');
  const response = await fetch(`${apiBase}/oauth/token`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ grant_type: 'authorization_code', client_id: 'chefu-admin-web', redirect_uri: `${window.location.origin}/auth/callback`, code, code_verifier: verifier }) });
  if (!response.ok) throw new Error('CHEFU SSO sign-in failed.');
  const data = await response.json() as { access_token?: string };
  if (!data.access_token) throw new Error('CHEFU SSO returned no access token.');
  sessionStorage.removeItem(verifierKey); sessionStorage.removeItem(stateKey); sessionStorage.setItem(tokenKey, data.access_token);
}
export { apiBase };