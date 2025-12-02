// Application configuration
// This file provides environment-specific settings

export const config = {
  // API URL - uses environment variable in production, empty string for same-origin in development
  apiUrl: import.meta.env.VITE_API_URL || '',
  
  // Other configuration options
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
};

// Helper function to build API URLs
export function getApiUrl(path: string): string {
  const baseUrl = config.apiUrl;
  
  // Ensure path starts with /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  
  // In development or when no API URL is set, use relative paths
  if (!baseUrl) {
    return normalizedPath;
  }
  
  // In production with external API, combine base URL and path
  return `${baseUrl}${normalizedPath}`;
}
