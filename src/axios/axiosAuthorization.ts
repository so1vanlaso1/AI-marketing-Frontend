import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { jwtDecode } from "jwt-decode";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";
const ACCESSID = process.env.NEXT_PUBLIC_ACCESSID ?? "";

export const axiosAuthorization = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    AccessID: ACCESSID,
  },
});



let refreshPromise: Promise<string> | null = null;

const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = jwtDecode<{ exp?: number }>(token);
    const now = Date.now() / 1000;
    return !(decoded?.exp && decoded.exp > now);
  } catch {
    return true;
  }
};

const refreshAccessToken = async (): Promise<string> => {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    try {
      const url = `${BASE_URL.replace(/\/$/, "")}/Auth/refreshtoken`;
      // use raw axios to avoid triggering this instance's interceptors
      const resp = await axios.post(url, null, {
        withCredentials: true, // if server reads refresh token from httpOnly cookie
        headers: { "Content-Type": "application/json", ACCESSID },
        timeout: 10000,
      });
      const accessToken: string | undefined = resp.data?.accessToken;
      if (!accessToken) throw new Error("No access token returned");
      localStorage.setItem("accessToken", accessToken);
      return accessToken;
    } catch (err) {
      localStorage.removeItem("accessToken");
      // optional: dispatch logout or redirect to login
      window.location.href = "/Auth/login";
      throw err;
    }
  })().finally(() => {
    refreshPromise = null;
  });

  return refreshPromise;
};

const shouldSkipAuth = (config?: InternalAxiosRequestConfig & { _skipAuth?: boolean }) => {
  const url = config?.url ?? "";
  const headers = (config?.headers ?? {}) as Record<string, unknown>;
  const skipHeader = Boolean(headers["x-skip-auth"] || headers["X-Skip-Auth"]);
  const skipFlag = Boolean((config as { _skipAuth?: boolean })?._skipAuth);
  const skipEndpoints = [
    "Auth/login",
    "/Auth/login",
    "Auth/register",
    "/Auth/register",
    "Auth/active",
    "/Auth/active",
    "Auth/refreshtoken",
    "/Auth/refreshtoken",
  ];
  console.log("Skip Auth Endpoints:", skipEndpoints);
  const isSkipEndpoint = skipEndpoints.some((e) => url.includes(e));
  return skipHeader || skipFlag || isSkipEndpoint;
};

// Request interceptor
axiosAuthorization.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const skipConfig = config as InternalAxiosRequestConfig & { _skipAuth?: boolean };
    if (shouldSkipAuth(skipConfig)){
      console.log(`[axios] ${config.method?.toUpperCase() ?? "GET"} ${axios.getUri({ ...config })}`);
      return config;
    }

    const accessToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
    let token = accessToken ?? null;

    if (token && isTokenExpired(token)) {
      try {
        token = await refreshAccessToken();
      } catch {
        return Promise.reject(new Error("Authentication failed"));
      }
    }

    if (token) {
      config.headers = config.headers ?? {};
      (config.headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
    }
    console.log(`[axios] ${config.method?.toUpperCase() ?? "GET"} ${axios.getUri({ ...config })}`);
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for 401 handling
axiosAuthorization.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = (error.config as InternalAxiosRequestConfig & { _retry?: boolean }) || undefined;
    if (!original) return Promise.reject(error);
    if (shouldSkipAuth(original)) return Promise.reject(error);

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const newToken = await refreshAccessToken();
        original.headers = original.headers ?? {};
        (original.headers as Record<string, string>)["Authorization"] = `Bearer ${newToken}`;
        return axiosAuthorization(original);
      } catch {
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);
