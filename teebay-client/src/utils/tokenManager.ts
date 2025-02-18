// In-memory token cache
let accessToken: string | null = null;

// Retrieve token (in-memory or from persistent storage)
export async function getAccessToken(): Promise<string | null> {
  if (accessToken) return accessToken;

  // Fallback to persistent storage
  const token = localStorage.getItem("accessToken");
  if (token) {
    console.log("[getAccessToken] Loaded token from storage.");
    accessToken = token; // Update in-memory cache
  }

  return token;
}

// Set token in memory and storage
export function setAccessToken(token: string | null): void {
  accessToken = token;

  if (token) {
    console.log("[setAccessToken] Saving token to storage.");
    localStorage.setItem("accessToken", token);
  } else {
    console.log("[setAccessToken] Clearing token.");
    localStorage.removeItem("accessToken");
  }
}
