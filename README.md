combine-section-selectors
===

Combines selectors into one object with proper path handling.

API
---

Every selector should have `get` prefix in name! E.g. `getMyValue`.

Also names of all selectors should be uniq.

#### default export:
```js
(modules: {[moduleName: string]: {[selectorName: string]: (sectionState, ...args, rootState) => ReturnType}}) =>
    ({[selectorName: string]: (rootState, ...args) => ReturnType})
```

Name of module should be exact same as key on where state is stored.
So if you have `state.users.userId`, you should combine selectors for `users` on `"users"` key:
```js
const fromState = combineSelectors({
    users: {
        getUser: (users, userId) => users[userId],
    },
});
fromState.getUser({users: {myId: {}}}, `myId`)
```

Selector implementation gets **substate** as first argument, and rest args just compied.

Selector from combine gets **entire state** as first argument, and any rest args.

Also selector implementation gets entire state as last argument. It's same as in `combine-section-reducer` module.


Example
---

### reducer for counter
```js
const counter = (state = 0, action) => {
    switch (action.type) {
        case `ADD`:
            return state + action.payload;
        default:
            return state;
    }
}
export default counter;
```

### selectors for counter
```js
export const getCount = (state, minusCount) => state - minusCount;
```

### combine
```js
import {combineReducers} from 'redux';
import combineSelectors from 'combine-section-selectors';
import counter from './counter';
import * as fromCounter from './counter.selectors';

const reducer = combineReducers({
    counter,
});

const fromState = combineSelectors({
    counter: fromCounter,
});

const store = createStore(reducer);
store.dispatch({type: `ADD`, payload: 5});
fromState.getCount(store.getState(), 3); // returns 2 (5 in state minus 3 from argument)
```

Motivation and alternatives
---
Without such module you should always set path to entity in selector:
```js
const getUser = (state, userId) => state.data.users.entities[userId];
```
which is awkward, because it makes this selector depending on where substate is connected to entire state.

Or even worse, pass path to substate on every usage of selector:
```js
fromState.getUser(state.data.users, userId);
```
