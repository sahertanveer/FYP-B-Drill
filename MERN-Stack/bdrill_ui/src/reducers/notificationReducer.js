import {
    NOTIFICATIONS_FOUND, NOTIFICATIONS_NOT_FOUND, ADD_NOTIFICATION, READ_NOTIFICATION, CANNOT_READ_NOTIFICATION
} from '../actions/types';

const initialState = {
    notificationsFound: false,
    notifications: [],
    notificationRead: false
}

export default function (state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case NOTIFICATIONS_FOUND:
            return {
                ...state,
                notifications: payload,
                notificationsFound: true
            }
        case NOTIFICATIONS_NOT_FOUND:
            return {
                ...state,
                notificationsFound: false
            }
        case ADD_NOTIFICATION:
            return {
                ...state,
                notifications: [...state.notifications, payload],
                notificationsFound: true
            }
        case READ_NOTIFICATION:
            let tempNotifications = state.notifications;
            const found = tempNotifications.findIndex(notif => notif.notification_id === payload)
            if (found !== -1) {
                state.notifications.splice(found, 1);
            }
            return {
                ...state,
                notificationRead: true
            }
        case CANNOT_READ_NOTIFICATION:
            return {
                ...state,
                notificationRead: false
            }
        default:
            return state;
    }
}