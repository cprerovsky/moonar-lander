/**
 * simple midpoint displacement implementation
 * @param numStartVals number of starting points for the terrain
 * @param iterations number of iterations to divide the terrain through
 * @return midpoint displaced array
 */
export default function midpoint(numStartVals: number, iterations: number): Array<number> {
    let arr: Array<number> = [];
    for (let i = 0; i < numStartVals; i++) {
        arr.push(Math.random());
    }

    let origArr = arr;
    let mdArr = [];
    let decay = 0.3;
    let midval = 0;
    for (let i = 0; i < iterations; i++) {
        origArr.map((val, j) => {
            if (j === 0) {
                mdArr.push(val);
                return;
            }
            midval = (val + origArr[j - 1] / 2) +
                (Math.random() - 0.5) * decay;
            if (midval > 1) midval = 1;
            mdArr.push(midval);
            mdArr.push(val);
        });
        origArr = mdArr;
        decay *= 0.8;
    }

    return origArr;
}