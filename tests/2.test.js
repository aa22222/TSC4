import { SmartContract, stackInt, stackCell, stackTuple} from "ton-contract-executor";
import { Cell, beginCell } from "ton-core";
import assert from "assert";
import { printLogs } from "./helpers.js";
import fs from "fs";

function multiply(A, B){
    let n = A.length, m = A[0].length, p = B[0].length;
    let re = Array(n).fill().map(() => Array(p).fill(BigInt(0)));
    for(let i = 0; i < n; i++){
        for(let j = 0; j < p; j++){
            for(let k = 0; k < m; k++){
                re[i][j] += BigInt(A[i][k] * B[k][j]); 
            }
        }
    }
    return re;
}
function printMatrix(A){
    for(let i= 0 ; i  < A.length; i++){
        console.log(A[i]);
    }
}
function equals(A, B){
    if(A.length != B.length) return false;
    if(A[0].length != B[0].length) return false; 
    for(let i = 0; i < A.length; i++){
        for(let j = 0; j < A[0].length; j++){
            if(A[i][j] != B[i][j]) return false;
        }
    }
    return true;
}
function stackMatrix(A){
    let re = Array(A.length).fill().map(()=>Array(A[0].length));
    for(let i = 0 ; i < A.length ; i++){
        for(let j = 0; j < A[0].length; j++){
            re[i][j] = stackInt(A[i][j]);
        }
        re[i] = stackTuple(re[i]);
    }
    return stackTuple(re);
}
const task = 2;
async function main() {
    const code = fs.readFileSync(`../build/${task}.compiled.txt`).toString();
    const contract = await SmartContract.fromCell(
        Cell.fromBoc(Buffer.from(code, 'base64'))[0],
        new Cell(),
        { debug: true }
    )
    let A = [ 
              [1, 2, 3, 4], 
              [5, 6, 7, 8],
            ];
    let B = [ 
              [1, 2],
              [3, 4],
              [5, 6],
              [7, 8],
            ];
    let re = await contract.invokeGetMethod("matrix_multiplier", [stackMatrix(A), stackMatrix(B)]);
    printMatrix(re.result[0]);
    printMatrix(multiply(A, B));
    assert(equals(multiply(A, B), re.result[0]));
    
}
main().then(() => {
    console.log("✅ All Tests Passed")
    process.exit(0);
});