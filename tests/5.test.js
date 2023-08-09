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
    let n = 115, k = 255;
    let re = await contract.invokeGetMethod('fibonacci_sequence', [stackInt(n), stackInt(k)]);
    for(let i = 0; i < k; i++){
        assert(re.result[0][i] == fib[n+i]);   
    }
    n = 0, k = 255;
    re = await contract.invokeGetMethod('fibonacci_sequence', [stackInt(n), stackInt(k)]);
    for(let i = 0; i < k; i++){
        assert(re.result[0][i] == fib[n+i]);   
    }
    n = 369, k = 1;
    re = await contract.invokeGetMethod('fibonacci_sequence', [stackInt(n), stackInt(k)]);
    for(let i = 0; i < k; i++){
        assert(re.result[0][i] == fib[n+i]);   
    }
    n = 368, k = 2;
    re = await contract.invokeGetMethod('fibonacci_sequence', [stackInt(n), stackInt(k)]);
    for(let i = 0; i < k; i++){
        assert(re.result[0][i] == fib[n+i]);   
    }
    n = 200, k = 170;
    re = await contract.invokeGetMethod('fibonacci_sequence', [stackInt(n), stackInt(k)]);
    for(let i = 0; i < k; i++){
        assert(re.result[0][i] == fib[n+i]);   
    }
    n = 114, k = 255;
    re = await contract.invokeGetMethod('fibonacci_sequence', [stackInt(n), stackInt(k)]);
    for(let i = 0; i < k; i++){
        assert(re.result[0][i] == fib[n+i]);   
    }
    n = 0, k = 255;
    re = await contract.invokeGetMethod('fibonacci_sequence', [stackInt(n), stackInt(k)]);
    for(let i = 0; i < k; i++){
        assert(re.result[0][i] == fib[n+i]);   
    }
    
}
main().then(() => {
    console.log("✅ All Tests Passed")
    process.exit(0);
});