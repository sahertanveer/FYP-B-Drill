import {
    VIS_TACTICS_FOUND, VIS_TACTICS_NOT_FOUND,
    VIS_ASSIGNMENTS_ATTEMPTED_STATUS_FOUND, VIS_ASSIGNMENTS_ATTEMPTED_STATUS_NOT_FOUND,
    VIS_ASSIGNMENTS_HISTORY_FOUND, VIS_ASSIGNMENTS_HISTORY_NOT_FOUND,
    VIS_MITRE_PERFORMANCE_FOUND, VIS_MITRE_PERFORMANCE_NOT_FOUND,
    VIS_PERFORMANCE_FOUND, VIS_PERFORMANCE_NOT_FOUND,
    VIS_SESSIONS_FOUND, VIS_SESSIONS_NOT_FOUND,
} from '../actions/types';

const initialState = {
    tacticsFound: false,
    tactics: [],
    assignmentAttemptedFound: false,
    assignmentAttemptedData :{},
    assignmentHistoryFound: false,
    assignmentHistoryData:{},
    mitrePerformanceFound: false,
    mitrePerformanceData:{},
    performanceFound: false, 
    performanceData:{},
    sessionsFound: false,
    sessionsData: []

    
}

export default function (state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case VIS_TACTICS_FOUND:
            return {
                ...state,
                tactics: payload,
                tacticsFound: true
            }
        case VIS_TACTICS_NOT_FOUND:
            return {
                ...state,
                tacticsFound: false
            }

        case VIS_ASSIGNMENTS_ATTEMPTED_STATUS_FOUND:
            return {
                ...state,
                assignmentAttemptedData: payload,
                assignmentAttemptedFound: true
            }
        case VIS_ASSIGNMENTS_ATTEMPTED_STATUS_NOT_FOUND:
            return {
                ...state,
                assignmentAttemptedFound: false
            }

        case VIS_ASSIGNMENTS_HISTORY_FOUND:
            return {
                ...state,
                assignmentHistoryData: payload,
                assignmentHistoryFound: true
            }
        case VIS_ASSIGNMENTS_HISTORY_NOT_FOUND:
            return {
                ...state,
                assignmentHistoryFound: false
            }

        case VIS_MITRE_PERFORMANCE_FOUND:
            return {
                ...state,
                mitrePerformanceData: payload,
                mitrePerformanceFound: true
            }
        case VIS_MITRE_PERFORMANCE_NOT_FOUND:
            return {
                ...state,
                mitrePerformanceFound: false
            }

        case VIS_PERFORMANCE_FOUND:
            return {
                ...state,
                performanceData: payload,
                performanceFound: true
            }
        case VIS_PERFORMANCE_NOT_FOUND:
            return {
                ...state,
                performanceFound: false
            }
        case VIS_SESSIONS_FOUND:
            return {
                ...state,
                sessionsData: payload,
                sessionsFound: true
            }
        case VIS_SESSIONS_NOT_FOUND:
            return {
                ...state,
                sessionsFound: false
            }

        default:
            return state;
    }
}