export const PRODUCTION_API_BASE_URL = "https://ghazl-fashion-production.up.railway.app";
const LOCAL_API_BASE_URL = "http://localhost:5000";

const normalizeBaseUrl = (url) => String(url || "").replace(/\/+$/, "");
const toApiUrl = (value) => {
  const normalizedValue = normalizeBaseUrl(value);
  if (!normalizedValue) {
    return "";
  }

  return /\/api$/i.test(normalizedValue)
    ? normalizedValue
    : `${normalizedValue}/api`;
};

const toBaseUrl = (value) => {
  return normalizeBaseUrl(value).replace(/\/api$/i, "");
};

const envBaseUrl = process.env.REACT_APP_API_BASE_URL;
const envApiUrl = process.env.REACT_APP_API_URL;
const localApiFlag = process.env.REACT_APP_USE_LOCAL_API;
const isLocalhost =
  typeof window !== "undefined" &&
  (window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1");

const useLocalApi =
  typeof localApiFlag === "string"
    ? localApiFlag.toLowerCase() === "true"
    : isLocalhost;

const envConfiguredBaseUrl = toBaseUrl(envBaseUrl || envApiUrl);
const envConfiguredApiUrl = toApiUrl(envApiUrl || envBaseUrl);
const defaultBaseUrl = useLocalApi ? LOCAL_API_BASE_URL : PRODUCTION_API_BASE_URL;

export const API_BASE_URL = envConfiguredBaseUrl || normalizeBaseUrl(defaultBaseUrl);

export const API_URL = envConfiguredApiUrl || toApiUrl(API_BASE_URL);
export const FALLBACK_API_URL = toApiUrl(PRODUCTION_API_BASE_URL);
