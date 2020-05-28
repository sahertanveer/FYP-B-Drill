import { SET_PAGE} from '../actions/types'

const initialState = {
    loadedPage: "canddashboard"
}

export default function(state = initialState, action) {
    const { type, name } = action

    switch(type) {
        case SET_PAGE:
            
            return {
                ...state,
                loadedPage:name
            }
       
        default:
            return state
    }

}