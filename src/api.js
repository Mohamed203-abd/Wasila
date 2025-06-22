// const BASE_URL = import.meta.env.DEV
// 'https://archievesystem-production.up.railway.app';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function apiFetch(endpoint, options = {}) {
    const url = `${BASE_URL.replace(/\/+$/, '')}/${endpoint.replace(/^\/+/, '')}`;
    const token = localStorage.getItem('accessToken');
    console.log("📡 Sending request to:", url);


    const headers = options.headers || {};

    if (!(options.body instanceof FormData)) {
        headers["Content-Type"] = "application/json";
    }

    if (token && !headers.Authorization) {
        headers.Authorization = `JWT ${token}`;
    }

    try {
        const response = await fetch(url, {
            ...options,
            headers,
        });

        if (response.status === 401) {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            window.location.href = "/login";
            throw new Error("انتهت صلاحية الجلسة، يرجى تسجيل الدخول مجدداً.");
        }

        const data = await response.json();

        if (!response.ok) {
            console.log("Server validation errors:", data);
            throw new Error(data.detail || "حدث خطأ أثناء الاتصال بالخادم.");
        }

        return data;
    } catch (error) {
        console.error('API Error:', error.message);
        throw error;
    }
}