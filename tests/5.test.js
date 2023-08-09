import { SmartContract, stackInt, stackCell} from "ton-contract-executor";
import { Cell, beginCell } from "ton-core";
import assert from "assert";
import { printLogs } from "./helpers.js";
import fs from "fs";


const task = 5;
async function main() {
    const code = fs.readFileSync(`../build/${task}.compiled.txt`).toString();
    const contract = await SmartContract.fromCell(
        Cell.fromBoc(Buffer.from(code, 'base64'))[0],
        new Cell(),
        { debug: true }
    )

    let fib = [BigInt(0), BigInt(1)];
    for(let i = 0; i < 400; i++){
        fib.push(fib[fib.length - 1] + fib[fib.length - 2]);
    }
    
    for(let n = 0; n <= 370; n++ ){
        for(let k = 0; k <= Math.min(370 - n, 255); k++){
            let re = await contract.invokeGetMethod('fibonacci_sequence', [stackInt(n), stackInt(k)]);
            assert(re.result[0].length == k+1);
            for(let i = 0; i <= k; i++){
                assert(re.result[0][i] == fib[n+i]);
            }
            if(k % 10 == 0) console.log((n, k));
        }
    }
    
}
main().then(() => {
    console.log("✅ All Tests Passed")
    process.exit(0);
});