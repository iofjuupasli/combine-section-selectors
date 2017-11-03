"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var combineSelectors = function combineSelectors(modules) {
    var result = {};

    var _loop = function _loop(moduleName) {
        // eslint-disable-line
        var moduleValue = modules[moduleName];

        var _loop2 = function _loop2(getterName) {
            // eslint-disable-line
            var getter = moduleValue[getterName];
            if (getterName.substr(0, 3) === "get") {
                if (result[getterName]) {
                    throw new Error("duplicated getter " + getterName);
                }
                result[getterName] = function (state) {
                    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                        args[_key - 1] = arguments[_key];
                    }

                    return getter.apply(undefined, [state[moduleName]].concat(args, [state]));
                };
            }
        };

        for (var getterName in moduleValue) {
            _loop2(getterName);
        }
    };

    for (var moduleName in modules) {
        _loop(moduleName);
    }
    return result;
};

exports.default = combineSelectors;

