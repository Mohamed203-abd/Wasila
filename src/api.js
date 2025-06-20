// const BASE_URL = import.meta.env.VITE_REACT_APP_BASE_URL;

// export const apiFetch = async (endpoint, options = {}) => {
//     const url = `${BASE_URL}${endpoint}`;

//     const defaultOptions = {
//         headers: {
//             "Content-Type": "application/json",
//             Accept: "application/json",
//         },
//         ...options,
//     };

//     const response = await fetch(url, defaultOptions);
//     return response;
// };

const BASE_URL = import.meta.env.PROD
    ? 'https://archievesystem-production.up.railway.app'
    : '/api'; // في التطوير هيستخدم البروكسي

export async function apiFetch(endpoint, options = {}) {
    const url = `${BASE_URL}${endpoint}`;
    const token = localStorage.getItem('accessToken');

    const headers = options.headers || {};

    if (!(options.body instanceof FormData)) {
        headers["Content-Type"] = "application/json";
    } else {
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







// const BASE_URL = 'https://archievesystem-production.up.railway.app';

// export async function apiFetch(endpoint, options = {}) {
//   const url = `${BASE_URL}${endpoint}`;

//   try {
//     const response = await fetch(url, {
//       ...options,
//       headers: {
//         'Content-Type': 'application/json',
//         ...(options.headers || {}),
//       },
//     });

//     return response;
//   } catch (error) {
//     console.error('API Error:', error.message);
//     throw error;
//   }
// }
