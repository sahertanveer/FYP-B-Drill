import {
    ATTACKS_NOT_FOUND, ATTACKS_FOUND,
    MACHINE_FOUND, MACHINE_NOT_FOUND,
    PLATFORM_FOUND, PLATFORM_NOT_FOUND,
    SESSIONS_FOUND, SESSIONS_NOT_FOUND,
    EVALUATION_FOUND, EVALUATION_NOT_FOUND,
    ASSIGNED, NOT_ASSIGNED,
    ATTACK_ADDED, ATTACK_ERROR,
    MACHINE_ADDED, MACHINE_ERROR,
    PLATFORM_ADDED, PLATFORM_ERROR,
} from '../actions/types';

const initialState = {
    attackAddedorUpdated: null,
    machineAddedorUpdated: null,
    platformAddedorUpdated: null,
    attacksFound: false,
    machineFound: false,
    platformFound: false,
    sessionsFound: false,
    evaluationDetailsFound: false,
    assignedSuccess: false,
}

export default function (state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case ATTACK_ADDED:
            return {
                ...state,
                attackAddedorUpdated: payload,
            };
        case ATTACK_ERROR:
            return {
                ...state,
                attackAddedorUpdated: null
            };
        case MACHINE_ADDED:
            return {
                ...state,
                machineAddedorUpdated: payload,
            };
        case MACHINE_ERROR:
            return {
                ...state,
                machineAddedorUpdated: null
            };
        case PLATFORM_ADDED:
            return {
                ...state,
                platformAddedorUpdated: payload,
            };
        case PLATFORM_ERROR:
            return {
                ...state,
                platformAddedorUpdated: null
            };
        case ATTACKS_FOUND:
            return {
                ...state,
                ...payload,
                attacksFound: true
            }
        case ATTACKS_NOT_FOUND:
            return {
                ...state,
                attacksFound: false
            }
        case MACHINE_FOUND:
            return {
                ...state,
                ...payload,
                machineFound: true
            }
        case MACHINE_NOT_FOUND:
            return {
                ...state,
                machineFound: false
            }
        case PLATFORM_FOUND:
            return {
                ...state,
                ...payload,
                platformFound: true
            }
        case PLATFORM_NOT_FOUND:
            return {
                ...state,
                platformFound: false
            }
        case SESSIONS_FOUND:
            return {
                ...state,
                ...payload,
                sessionsFound: true
            }
        case SESSIONS_NOT_FOUND:
            return {
                ...state,
                sessionsFound: false
            }
        case EVALUATION_FOUND:
            return {
                ...state,
                ...payload,
                evaluationDetailsFound: true
            }
        case EVALUATION_NOT_FOUND:
            return {
                ...state,
                evaluationDetailsFound: false
            }
        case ASSIGNED:
            return {
                ...state,
                assignedSuccess: true
            }

        case NOT_ASSIGNED:
            return {
                ...state,
                assignedSuccess: false
            }
        default:
            return state;
    }
}