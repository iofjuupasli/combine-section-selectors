// @flow
const combineSelectors = (modules: {[string]: {[string]: Function}}): {[string]: Function} => {
    const result = {};
    for (const moduleName in modules) { // eslint-disable-line
        const moduleValue = modules[moduleName];
        for (const getterName in moduleValue) { // eslint-disable-line
            const getter = moduleValue[getterName];
            if (getterName.substr(0, 3) === `get`) {
                if (result[getterName]) {
                    throw new Error(`duplicated getter ${getterName}`);
                }
                result[getterName] = (state, ...args) => getter(state[moduleName], ...args, state);
            }
        }
    }
    return result;
};

export type MapSelectors<Key, SubSelectors> =
    $ObjMap<SubSelectors,
        <SubState, Return, A1, A2, A3, A4>
            (selector: (SubState, A1, A2, A3, A4) => Return) => ({[Key]: SubState}, A1, A2, A3, A4) => Return>;

export default combineSelectors;
