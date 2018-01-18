// @flow

import lodash from 'lodash';

// ACTION NAMES
type enhancedActionNames = {
  REQUEST?: {
    [string]: {
      START: string,
      SUCCESS: string,
      FAILED: string,
      RESET: string,
    },
  },
  resetStore: string,
};

type ActionType<T> = {
  type: string,
  payload: T,
  routeName?: string,
};

type RequestStatusType = {
  loading: boolean,
  failed: boolean,
};

type StateType = {
  requests: { [string]: RequestStatusType },
};

export const enhanceActionTypes = (
  storeName?: string,
  requestActionTitles?: string[]
): enhancedActionNames => {
  let requestActionTypes = {};

  if (storeName && requestActionTitles) {
    const definedStoreName = storeName;
    requestActionTypes = requestActionTitles.reduce(
      (reduced, action) => ({
        ...reduced,
        REQUEST: {
          ...reduced.REQUEST,
          [action]: {
            START: `${definedStoreName}.REQUEST.${action}.START`,
            SUCCESS: `${definedStoreName}.REQUEST.${action}.SUCCESS`,
            FAILED: `${definedStoreName}.REQUEST.${action}.FAILED`,
            RESET: `${definedStoreName}.REQUEST.${action}.RESET`,
          },
        },
      }),
      { REQUEST: {} }
    );
  }

  return {
    ...requestActionTypes,
    resetStore: 'RESET_STORE',
  };
};

// ACTION CREATORS
export const enhanceActionCreators = (
  storeName?: string,
  requestActionTitles?: string[],
  actionTypes?: {
    REQUEST: {
      [string]: {
        START: string,
        SUCCESS: string,
        FAILED: string,
        RESET: string,
      },
    },
  }
): { [string]: Function, emptyStore: Function } => {
  let requestActionCreators = {};

  if (requestActionTitles && actionTypes && actionTypes.REQUEST)
    requestActionCreators = requestActionTitles.reduce(
      (reducedObject, actionTitle) => {
        const camelCaseActionTitle: string = lodash.camelCase(actionTitle);
        const pascalCaseActionTitle =
          camelCaseActionTitle[0].toUpperCase() + camelCaseActionTitle.slice(1);

        return {
          ...reducedObject,
          [`request${pascalCaseActionTitle}Start`]: (payload: Object) => ({
            type: actionTypes && actionTypes.REQUEST[actionTitle].START,
            payload,
          }),
          [`request${pascalCaseActionTitle}Success`]: (payload: Object) => ({
            type: actionTypes && actionTypes.REQUEST[actionTitle].SUCCESS,
            payload,
          }),
          [`request${pascalCaseActionTitle}Failed`]: (payload: Object) => ({
            type: actionTypes && actionTypes.REQUEST[actionTitle].FAILED,
            payload,
            error: true,
          }),
          [`request${pascalCaseActionTitle}Reset`]: () => ({
            type: actionTypes && actionTypes.REQUEST[actionTitle].RESET,
          }),
        };
      },
      {}
    );

  return {
    ...requestActionCreators,
    emptyStore: () => ({ type: 'RESET_STORE' }),
  };
};

// REDUCERS
export const enhanceDefaultState = (requestActionTitles: string[]): StateType =>
  requestActionTitles.reduce(
    (reducedObject, actionTitle) => ({
      ...reducedObject,
      requests: {
        ...reducedObject.requests,
        [actionTitle]: {
          loading: false,
          failed: false,
        },
      },
    }),
    { requests: {} }
  );

const parseErrorIfExists = (action: ActionType<*>): string | boolean => {
  const errorText = lodash.get(action, 'payload.response.text');
  return errorText ? JSON.parse(errorText) : false;
};

export const enhanceReducer = (
  storeName: string,
  state: StateType,
  action: ActionType<*>,
  initialState: StateType,
  reducer: (state: StateType, action: ActionType<*>) => void
): {
  ...Object,
  requests: { [string]: RequestStatusType },
} => {
  let enhancedState;

  const requestActionType = action.type.match(/(.*).REQUEST\.(.*)\.(.*)/);
  if (requestActionType && requestActionType[1] === storeName) {
    enhancedState = {
      ...state,
      requests: {
        ...state.requests,
        [requestActionType[2]]: {
          loading: requestActionType[3] === 'START',
          failed:
            parseErrorIfExists(action) || requestActionType[3] === 'FAILED',
        },
      },
    };
  }

  if (action.type === 'RESET_STORE') return { ...initialState };

  return reducer(enhancedState || state, action);
};

// SELECTORS
export const enhanceSelectors = (
  storeName: string,
  requestActionTitles: string[]
): { [string]: Function } =>
  requestActionTitles.reduce(
    (reducedObject, actionTitle) => ({
      ...reducedObject,
      [`${lodash.camelCase(actionTitle)}Loading`]: (state: *) =>
        lodash.get(
          state,
          `${lodash.camelCase(storeName)}.requests.${actionTitle}.loading`
        ),
      [`${lodash.camelCase(actionTitle)}Failed`]: (state: *) =>
        lodash.get(
          state,
          `${lodash.camelCase(storeName)}.requests.${actionTitle}.failed`
        ),
    }),
    {}
  );
