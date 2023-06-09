export const endpoints = (name) => {
    const isLocal = window.location.origin.includes('localhost');
    const CLIP_API = isLocal ? process.env.NEXT_PUBLIC_CLIP_API : process.env.NEXT_PUBLIC_CLIP_API;
    const endpoints = {
        // -- old endpoints --
        results: `${CLIP_API}search?query=`,
        byIds:  `${CLIP_API}search?ids=`
    }
    return endpoints[name];
}