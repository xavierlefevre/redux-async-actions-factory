import {
  enhanceReducer,
  enhanceActionTypes,
  enhanceSelectors,
} from './reduxEnhancer';

describe('enhanceActionTypes', () => {
  it('should automaticaly add the necessary actions types for a request action', () => {
    const expectedOutput = {
      REQUEST: {
        LOGIN: {
          START: `USER.REQUEST.LOGIN.START`,
          SUCCESS: `USER.REQUEST.LOGIN.SUCCESS`,
          FAILED: `USER.REQUEST.LOGIN.FAILED`,
          RESET: `USER.REQUEST.LOGIN.RESET`,
        },
        SIGNUP: {
          START: `USER.REQUEST.SIGNUP.START`,
          SUCCESS: `USER.REQUEST.SIGNUP.SUCCESS`,
          FAILED: `USER.REQUEST.SIGNUP.FAILED`,
          RESET: `USER.REQUEST.SIGNUP.RESET`,
        },
      },
      resetStore: 'RESET_STORE',
    };
    const output = enhanceActionTypes('USER', ['LOGIN', 'SIGNUP']);

    expect(output).toEqual(expectedOutput);
  });
});

describe('enhanceReducer', () => {
  it(`should pass through the state to the entity reducer 
if the action is not known from the enhanceReducer`, () => {
    const expectedOutput = {
      trophies: ['yeah'],
    };

    const storeName = 'USER';
    const currentState = { trophies: ['yeah'] };
    const action = { type: 'USER.TROPHIES.UNLOCK' };
    const defaultState = {};
    const entityReducer = state => state;

    const output = enhanceReducer(
      storeName,
      currentState,
      action,
      defaultState,
      entityReducer
    );

    expect(output).toEqual(expectedOutput);
  });

  it(`should reset the store with initialState: 0`, () => {
    const expectedOutput = {
      initialState: 0,
    };

    const storeName = 'MODULE';
    const currentState = { modifiedState: Infinity };
    const action = { type: 'RESET_STORE' };
    const defaultState = { initialState: 0 };
    const entityReducer = state => state;

    const output = enhanceReducer(
      storeName,
      currentState,
      action,
      defaultState,
      entityReducer
    );

    expect(output).toEqual(expectedOutput);
  });

  it('should pass loading to true and failed to false when requesting a login', () => {
    const expectedOutput = {
      requests: {
        LOGIN: {
          loading: true,
          failed: false,
        },
      },
    };

    const storeName = 'USER';
    const currentState = {};
    const action = { type: 'USER.REQUEST.LOGIN.START' };
    const defaultState = {};
    const entityReducer = state => state;

    const output = enhanceReducer(
      storeName,
      currentState,
      action,
      defaultState,
      entityReducer
    );

    expect(output).toEqual(expectedOutput);
  });

  it('should pass loading to false and failed to false when success on login', () => {
    const expectedOutput = {
      requests: {
        LOGIN: {
          loading: false,
          failed: false,
        },
      },
    };

    const storeName = 'USER';
    const currentState = {};
    const action = { type: 'USER.REQUEST.LOGIN.SUCCESS' };
    const defaultState = {};
    const entityReducer = state => state;

    const output = enhanceReducer(
      storeName,
      currentState,
      action,
      defaultState,
      entityReducer
    );

    expect(output).toEqual(expectedOutput);
  });

  it('should pass loading to false and failed to true when error on login', () => {
    const expectedOutput = {
      requests: {
        LOGIN: {
          loading: false,
          failed: true,
        },
      },
    };

    const storeName = 'USER';
    const currentState = {};
    const action = { type: 'USER.REQUEST.LOGIN.FAILED' };
    const defaultState = {};
    const entityReducer = state => state;

    const output = enhanceReducer(
      storeName,
      currentState,
      action,
      defaultState,
      entityReducer
    );

    expect(output).toEqual(expectedOutput);
  });

  it('should pass loading to false and failed to false when reset login', () => {
    const expectedOutput = {
      requests: {
        LOGIN: {
          loading: false,
          failed: false,
        },
      },
    };

    const storeName = 'USER';
    const currentState = {
      requests: {
        LOGIN: {
          loading: true,
          failed: false,
        },
      },
    };
    const action = { type: 'USER.REQUEST.LOGIN.RESET' };
    const defaultState = {};
    const entityReducer = state => state;

    const output = enhanceReducer(
      storeName,
      currentState,
      action,
      defaultState,
      entityReducer
    );

    expect(output).toEqual(expectedOutput);
  });
});

describe('enhanceSelectors', () => {
  it('should automaticaly add the necessary selectors for request actions', () => {
    const expectedOutput = {
      loginLoading: () => {},
      loginFailed: () => {},
      signupLoading: () => {},
      signupFailed: () => {},
    };
    const output = enhanceSelectors('user', ['LOGIN', 'SIGNUP']);

    expect(Object.keys(output)).toEqual(Object.keys(expectedOutput));
  });
});
