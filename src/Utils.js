const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getFullFileUrl = (path) =>
    path ? `${BASE_URL.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}` : null;
