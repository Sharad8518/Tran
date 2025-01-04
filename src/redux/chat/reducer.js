import { APPEND_MESSAGE, EXIT_CHAT, SET_ACTIVE_CHAT_ID, SET_CHAT_IDS, SET_MESSAGES, SET_UNREAD_COUNT } from "./types"

const initialChatState = {
    chats: null,
    isLoading: true,
    isChatLoading: true,
    messages: null,
    activeChatId: null,
    unreadCounts: {}
}
export default (state = initialChatState, { type, payload }) => {
    switch (type) {
        case SET_CHAT_IDS:
            return {
                ...state,
                chats: payload,
                isLoading: false
            }
        case SET_ACTIVE_CHAT_ID:
            return {
                ...state,
                activeChatId: payload.chatId,
                messages: payload.messages,
                isChatLoading: false
            }
        case SET_UNREAD_COUNT:
            const unreadCounts = { ...state.unreadCounts }
            unreadCounts[payload.chatId] = {
                count: payload.count,
                lastSeen: payload.lastSeen
            }
            return {
                ...state,
                unreadCounts
            }
        case APPEND_MESSAGE:
            return {
                ...state,
                messages: [...state.messages, payload],
            }
        case EXIT_CHAT:
            return {
                ...state,
                activeChatId: null,
                messages: null,
                isChatLoading: true
            }
        default:
            return { ...state }
    }
}