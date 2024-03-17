export function make(type, payload) {
    return JSON.stringify({type, payload});
}
