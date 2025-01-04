import { objToArray } from "../../utils/objToArray"
import { APPEND_MESSAGE, EXIT_CHAT, SET_ACTIVE_CHAT_ID, SET_CHAT_IDS, SET_MESSAGES, SET_UNREAD_COUNT } from "./types"
import database from '@react-native-firebase/database'
import { databaseRefs } from "../../config/variables"
export const setChatIds = (chatIds) => {
    return {
        type: SET_CHAT_IDS,
        payload: chatIds
    }
}
export const exitChat = () => {
    return {
        type: EXIT_CHAT
    }
}
export const setActiveChatId = (id) => {
    return (dispatch, getState) => {
        // fetch messages here
        // and then set active chat id as well as messages together
        database()
            .ref(databaseRefs.messages)
            .child(`${id}`)
            .on('value', snap => {
                const messages = snap.val()
                const conversion = objToArray(messages).sort((a, b) => b.timestamp - a.timestamp).map(m => ({ ...m, createdAt: m.timestamp }))
                dispatch({
                    type: SET_ACTIVE_CHAT_ID,
                    payload: { chatId: id, messages: conversion }
                })
            })

    }
}
export const setUnreadCount = (chatId, count, lastSeen) => {
    return {
        type: SET_UNREAD_COUNT,
        payload: { chatId, count, lastSeen }
    }
}
export const appendMessage = (payload) => {
    return {
        type: APPEND_MESSAGE,
        payload
    }
}
export const setMessages = (messages) => {
    // this will be used to add new messages of active chat
    return {
        type: SET_MESSAGES,
        payload: messages
    }
}