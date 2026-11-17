import Clarity from '@microsoft/clarity';

// Microsoft Clarity: heatmaps and session recordings.
//
// Off unless VITE_CLARITY_PROJECT_ID is set (Clarity > Settings > Overview).
// Like every VITE_* value it is baked into the bundle at build time, so dev
// and local builds without it never load the Clarity script or send anything.
const PROJECT_ID = import.meta.env.VITE_CLARITY_PROJECT_ID as
  | string
  | undefined;

let started = false;

export function initClarity(): void {
  if (started || !PROJECT_ID) return;
  try {
    Clarity.init(PROJECT_ID);
    started = true;
  } catch (e) {
    // Analytics must never take the app down (blocked by an ad blocker, ...).
    console.error('Clarity: failed to start', e);
  }
}

// Ties the session to the logged-in user, so recordings can be filtered by
// user and by admin. Only the internal id goes out: Clarity hashes the custom
// id in the browser, while a name or e-mail would be personal data stored by a
// third party. No friendlyName for the same reason.
export function identifyClarityUser(user: { id: number; is_admin: boolean }) {
  if (!started) return;
  try {
    Clarity.identify(String(user.id));
    Clarity.setTag('user_type', user.is_admin ? 'admin' : 'user');
  } catch (e) {
    console.error('Clarity: failed to identify the user', e);
  }
}
