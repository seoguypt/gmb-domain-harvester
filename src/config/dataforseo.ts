// Log environment variables to debug
console.log('Environment variables:', {
  login: import.meta.env.VITE_DATAFORSEO_LOGIN,
  password: import.meta.env.VITE_DATAFORSEO_PASSWORD
});

export const DATAFORSEO_CONFIG = {
  login: import.meta.env.VITE_DATAFORSEO_LOGIN as string,
  password: import.meta.env.VITE_DATAFORSEO_PASSWORD as string
};
