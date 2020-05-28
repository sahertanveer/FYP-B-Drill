import { SET_PAGE } from './types'

export const setPage = (pageName) => dispatch => {
    dispatch({
        type: SET_PAGE,
        name:pageName
      });

}

// export const loadPage = () => async dispatch => {
//     dispatch({
//         type: PAGE_LOADED
//       });

// }