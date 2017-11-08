import combineSelectors from '../index';

describe(`combineSelectors`, () => {
    it(`should fail if one getter name used twice`, () => {
        expect(() => {
            combineSelectors({
                a: {
                    getX: () => {},
                },
                b: {
                    getX: () => {},
                },
            });
        }).toThrow(`duplicated getter getX`);
    });
    it(`should combine selectors from all modules`, () => {
        const fromState = combineSelectors({
            a: {
                getX: () => {},
            },
            b: {
                getY: () => {},
            },
        });
        expect(fromState).toHaveProperty(`getX`);
        expect(fromState).toHaveProperty(`getY`);
    });
    it(`should use key for selector modules to get state`, () => {
        const fromState = combineSelectors({
            a: {
                getA: (aState) => aState,
            },
            b: {
                getB: (bState) => bState,
            },
        });
        const state = {
            a: `A`,
            b: `B`,
        }
        expect(fromState.getA(state)).toEqual(`A`);
        expect(fromState.getB(state)).toEqual(`B`);
    });
    it(`should pass args and entire state as last argument to selector`, () => {
        const fromState = combineSelectors({
            a: {
                getA: (aState, value, rootState) => ({aState, value, rootState}),
            },
        });
        const state = {
            a: `A`,
        };
        expect(fromState.getA(state, 1)).toEqual({
            aState: `A`,
            value: 1,
            rootState: state,
        });
    });
    it(`should ignore getters without "get" prefix`, () => {
        const fromState = combineSelectors({
            a: {
                getA: () => {},
                doSomething: () => {},
            },
        });
        expect(fromState).toHaveProperty(`getA`);
        expect(fromState).not.toHaveProperty(`doSomething`);
    });
});
