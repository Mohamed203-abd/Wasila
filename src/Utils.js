const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getFullFileUrl = (path) => {
    if (!path) return null;

    if (/^https?:\/\//i.test(path)) return path;

    return `${BASE_URL.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`;
};