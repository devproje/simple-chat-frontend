export const payloadType = {
    setUsername: "set_username",
    newMessage: "new_message"
}

export function make(type, payload) {
    return JSON.stringify({type, payload});
}
