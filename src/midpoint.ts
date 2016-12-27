/**
 * simple midpoint displacement implementation
 * @param numStartVals number of starting points for the terrain
 * @param iterations number of iterations to divide the terrain through
 * @return midpoint displaced array
 */
export default function midpoint(numStartVals: number, iterations: number): Array<number> {
    let arr:Array<number> = [];
    for (let i=0; i<numStartVals; i++) {
        arr.push(Math.random());
    }
    
    let origArr = arr;
    let mdArr = [];
    let decay = 0.5;
    for (let i=0; i<iterations; i++) {
        origArr.map((val, j) => {
            if (j === 0) {
                mdArr.push(val);
                return;    
            }

            mdArr.push((val + origArr[j-1] / 2) + (Math.random() - 0.5) * decay);
        });
        origArr = mdArr;
        decay *= 0.8;
    }    
    
    return origArr;
}