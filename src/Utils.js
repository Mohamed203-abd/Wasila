const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getFullFileUrl = (path) => {
    if (!path) return null;

    // لو الرابط بالفعل كامل (يبدأ بـ http/https) استخدمه كما هو
    if (/^https?:\/\//i.test(path)) return path;

    // دمج BASE_URL مع path بعد إزالة أو إضافة الـ /
    return `${BASE_URL.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`;
};

