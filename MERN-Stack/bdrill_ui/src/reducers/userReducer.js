import {
    MANAGER_ADDED, CANDIDATE_ADDED, MANAGER_NOT_ADDED, CANDIDATE_NOT_ADDED, USERS_FOUND,
    USERS_NOT_FOUND, CANDIDATE_NOT_FOUND, CANDIDATE_FOUND, MANAGERS_FOUND, MANAGERS_NOT_FOUND, USER_DELETED, USER_NOT_DELETED,
    ORGANIZATION_FOUND, ORGANIZATION_NOT_FOUND
} from '../actions/types';

const initialState = {
    usersFound: false,
    managersFound: false,
    organizationFound: false,
    userDeleted: false,
    candidateRegistered: false,
    managerRegistered: false,
    candidateFound: false
}

export default function (state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case MANAGER_ADDED:
            return {
                ...state,
                managerRegistered: true
            }
        case MANAGER_NOT_ADDED:
            return {
                ...state,
                managerRegistered: false
            }
        case CANDIDATE_ADDED:
            return {
                ...state,
                candidateRegistered: true
            }
        case CANDIDATE_NOT_ADDED:
            return {
                ...state,
                candidateRegistered: false
            }
        case ORGANIZATION_FOUND:
            return {
                ...state,
                ...payload,
                organizationFound: true
            }
        case ORGANIZATION_NOT_FOUND:
            return {
                ...state,
                ...payload,
                organizationFound: false
            }
        case MANAGERS_FOUND:
            return {
                ...state,
                ...payload,
                managersFound: true
            }
        case MANAGERS_NOT_FOUND:
            return {
                ...state,
                ...payload,
                managersFound: false
            }
        case USERS_FOUND:
            return {
                ...state,
                ...payload,
                usersFound: true
            }
        case USERS_NOT_FOUND:
            return {
                ...state,
                usersFound: false
            }
        case CANDIDATE_FOUND:
            return {
                ...state,
                ...payload,
                candidateFound: true
            }
        case CANDIDATE_NOT_FOUND:
            return {
                ...state,
                candidateFound: false
            }
        case USER_DELETED:
            return {
                userDeleted: true,
            }
        case USER_NOT_DELETED:
            return {
                userDeleted: false,
            }
        default:
            return state;
    }
}