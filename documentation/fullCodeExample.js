import {
  enhanceActionTypes,
  enhanceActionCreators,
  enhanceDefaultState,
  enhanceReducer,
  enhanceSelectors,
} from 'redux-enhancer';

const storeName = 'USER';
const asyncActionsNames = ['SIGNUP'];

const actionTypes = {
  ...enhanceActionTypes(storeName, asyncActionsNames),
  LOGOUT: 'LOGOUT',
};

const actionCreators = {
  ...enhanceActionCreators(),
  startSignup: signupInfo => ({
    type: actionTypes.REQUEST.SIGNUP.START,
    payload: signupInfo,
  }),
  resetSignup: () => ({
    type: actionTypes.REQUEST.SIGNUP.RESET,
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

const reducer = (state = defaultState, action) =>
  enhanceReducer(storeName, state, action, defaultState, basicReducer);

const selectors = {
  ...enhanceSelectors(storeName, asyncActionsNames),
  token: state => state.user.token,
};
