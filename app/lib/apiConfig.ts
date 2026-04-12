
/**
 * Detects the correct API Base URL.
 * When on mobile, 'localhost' will fail, so we use the IP from the browser's address bar.
 */
const getBaseUrl = () => {
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;
    // If we're accessing via an IP address (like 192.168.1.3 or any other), use that same IP for the backend
    if (hostname !== "localhost" && hostname !== "127.0.0.1") {
      return `http://${hostname}:5000`;
    }
  }
  // Default for local development on the laptop itself
  return "http://localhost:5000";
};

export const API_BASE_URL = getBaseUrl();
