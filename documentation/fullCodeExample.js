import {
  enhanceActionTypes,
  enhanceActionCreators,
  enhanceDefaultState,
  enhanceReducer,
  enhanceSelectors,
} from 'redux-async-actions-factory';

const storeName = 'USER';
const asyncActionsNames = ['SIGNUP'];

export const actionTypes = {
  ...enhanceActionTypes(storeName, asyncActionsNames),
  LOGOUT: 'LOGOUT',
};

export const actionCreators = {
  ...enhanceActionCreators(storeName, asyncActionsNames, actionTypes),
  requestSignupStart: signupInfo => ({
    type: actionTypes.REQUEST.SIGNUP.START,
    payload: signupInfo,
  }),
};

const defaultState = {
  ...enhanceDefaultState(asyncActionsNames),
};

const basicReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.REQUEST.SIGNUP.SUCCESS:
      return {
        ...state,
        token: action.payload.token,
      };
    default:
      return state;
  }
};

export const reducer = (state = defaultState, action) =>
  enhanceReducer(storeName, state, action, defaultState, basicReducer);

export const selectors = {
  ...enhanceSelectors(storeName, asyncActionsNames),
  token: state => state.user.token,
};
