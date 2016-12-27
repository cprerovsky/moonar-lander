"use strict";
/**
 * simple midpoint displacement implementation
 * @param numStartVals number of starting points for the terrain
 * @param iterations number of iterations to divide the terrain through
 * @return midpoint displaced array
 */
function midpoint(numStartVals, iterations) {
    var arr = [];
    for (var i = 0; i < numStartVals; i++) {
        arr.push(Math.random());
    }
    var origArr = arr;
    var mdArr = [];
    var decay = 0.5;
    for (var i = 0; i < iterations; i++) {
        origArr.map(function (val, j) {
            if (j === 0) {
                mdArr.push(val);
                return;
            }
            mdArr.push((val + origArr[j - 1] / 2) + (Math.random() - 0.5) * decay);
        });
        origArr = mdArr;
        decay *= 0.8;
    }
    return origArr;
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = midpoint;
//# sourceMappingURL=midpoint.js.map