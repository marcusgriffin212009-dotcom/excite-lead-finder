const REMEMBER_KEY = "llx_remember_me";
const SESSION_KEY = "llx_session_active";

export function setRememberMe(remember: boolean) {
  try {
    localStorage.setItem(REMEMBER_KEY, remember ? "1" : "0");
    sessionStorage.setItem(SESSION_KEY, "1");
  } catch {
    /* ignore */
  }
}

/**
 * When "remember me" was off, the session should not survive a browser restart.
 * A fresh browser session has no sessionStorage marker, so we sign the user out.
 */
export async function enforceRememberMe(signOut: () => Promise<unknown>) {
  try {
    const remember = localStorage.getItem(REMEMBER_KEY);
    if (remember !== "0") return;
    if (sessionStorage.getItem(SESSION_KEY) === "1") return;
    localStorage.removeItem(REMEMBER_KEY);
    await signOut();
  } catch {
    /* ignore */
  }
}
