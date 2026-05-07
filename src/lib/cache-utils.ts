/**
 * Utility to clear all local application data, including localStorage, 
 * sessionStorage, and cookies. Useful for debugging or resetting the app state.
 */
export const clearAllAppData = () => {
  // Clear storage
  localStorage.clear();
  sessionStorage.clear();

  // Clear cookies
  const cookies = document.cookie.split(";");
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i];
    const eqPos = cookie.indexOf("=");
    const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
  }

  // Force reload to clear memory state
  window.location.reload();
};
