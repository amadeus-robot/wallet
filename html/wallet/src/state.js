import deepmerge from 'deepmerge'

//Fixed in Create React App 5 but we cant use cuz CRACO dont work
const globalThis = window;

var inject={replace:"me"};

export var initialState = {
  path: globalThis.location.pathname == "" ? "/" : globalThis.location.pathname,
  remote: {
  	coin: 0,
    checked_balance: false,
  },
  menu: {
    modal_public_key_open: false,
    modal_private_key_open: false,
  },
  dashboard: {
    coin: 0,
  },
  wizard_new_user: {
    open: true,
    slider_state: [0],
    seed64: "",
  },
};

function isMergeableObject(value) {
    return isNonNullObject(value)
        && !isSpecial(value)
}

function isNonNullObject(value) {
    return !!value && typeof value === 'object'
}

function isSpecial(value) {
    var stringValue = Object.prototype.toString.call(value)

    return stringValue === '[object RegExp]'
        || stringValue === '[object Date]'
        || stringValue === '[object Uint8Array]'
        || isReactElement(value)
}

var canUseSymbol = typeof Symbol === 'function' && Symbol.for
var REACT_ELEMENT_TYPE = canUseSymbol ? Symbol.for('react.element') : 0xeac7

function isReactElement(value) {
    return value.$$typeof === REACT_ELEMENT_TYPE
}

export let globalState = {};
export let setGlobalState0 = () => {};
export let setGlobalState = (new_state) => {
    var state = deepmerge(globalState, new_state, {
        arrayMerge: (dest, source, opts) => source,
        isMergeableObject: (obj)=> isMergeableObject(obj)
    })
    globalState = state
    setGlobalState0(state);
};
export let setGlobalStateFull = (new_state) => {
    globalState = new_state
    setGlobalState0(new_state);
};

export let mergeObjects = (old_state, new_state) => {
    var state = deepmerge(old_state, new_state, {
        arrayMerge: (dest, source, opts) => source,
        isMergeableObject: (obj)=> isMergeableObject(obj)
    })
    return state;
};

export function wireUpGlobalState(hook_globalState, hook_setGlobalState0) {
    globalState = hook_globalState;
    setGlobalState0 = hook_setGlobalState0;
}

export function buildInitialState() {
    return {
        ...initialState,
    };
};

export function getInitialState() {
    return initialState;
};

export function setInitialState(state) {
    initialState = mergeObjects(initialState, state)
    return initialState;
};

export const doNav = async (e, next_page) => {
    if (e) {
      e.preventDefault();
    }
    if (globalState.path !== next_page) {
      globalThis.history.pushState(undefined, undefined, `${next_page}`);
      setGlobalState({path: next_page});
    }
    return false;
}

globalThis.onpopstate = function(e) {
    var next_page = globalThis.location.pathname;
    setGlobalState({path: next_page});
}
