const API_KEY = process.env.NEXT_PUBLIC_CLIP_API_KEY || 'mqE1n8Q8AkX2EyNa42QeCIk6sjnDaodi';

export const endpoints = (name) => {
    const isLocal = typeof window !== 'undefined' && window.location.origin.includes('localhost');
    const CLIP_API = isLocal ? process.env.NEXT_PUBLIC_CLIP_API : process.env.NEXT_PUBLIC_CLIP_API;

    const endpoints = {
        results: `${CLIP_API}search?`,
        byIds: `${CLIP_API}search?ids=`,
        similarProducts: `${CLIP_API}most_similar_items?top_k=20&id=`,
        dedicatedProduct: `${CLIP_API}product?id=`,
        brands: `${CLIP_API}brands_list`,
    };
    return endpoints[name];
}

export const getHeaders = () => {
    return {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
    };
}

export const fetchWithAuth = async (url, options = {}) => {
    const headers = getHeaders();
    const response = await fetch(url, {
        ...options,
        headers: {
            ...headers,
            ...options.headers
        }
    });
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
}
