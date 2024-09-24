export const endpoints = (name) => {
    const isLocal = window.location.origin.includes('localhost');
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