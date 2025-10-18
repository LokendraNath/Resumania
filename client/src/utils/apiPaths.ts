/* eslint-disable @typescript-eslint/no-explicit-any */
export const BASE_URL = "https://localhost:4000/";

// Routes Used For Frontend
export const API_PATHS = {
  AUTH: {
    REGISTER: "/api/auth/register",
    LOGIN: "/api/auth/login",
    GET_PROFILE: "/api/auth/login",
  },
  RESUME: {
    CREATE: "/api/resume",
    GET_ALL: "/api/resume",
    GET_BY_ID: (id: any) => `/api/resume/${id}`,

    UPDATE: (id: any) => `/api/resume/${id}`,
    DELETE: (id: any) => `/api/resume/${id}`,
    UPLOAD_IMAGES: (id: any) => `/api/resume/${id}`,
  },
  IMAGE: {
    UPLOAD_IMAGE: "/api/auth/upload-image",
  },
};
