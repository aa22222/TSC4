import { SmartContract, stackInt, stackCell} from "ton-contract-executor";
import { Cell, beginCell } from "ton-core";
import assert from "assert";
import { printLogs } from "./helpers.js";
import fs from "fs";

const task = 5;
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
async function test(n, k){
    let re = await contract.invokeGetMethod('fibonacci_sequence', [stackInt(n), stackInt(k)]);
    console.log(re.gas_consumed);
    if(re.type != "success") console.log(re.logs)
    for(let i = 0; i < k; i++){
        assert(re.result[0][i] == fib[i + n]);
    }
}

async function main() {
    await test(253, 2);
    await test(203, 23);
    await test(153, 3);
    await test(1, 3);
    await test(55, 255);
    await test(120, 23);
    await test(302, 3);
    await test(300, 3);
    await test(350, 3);
    await test(351, 3);
}
main().then(() => {
    console.log("✅ All Tests Passed")
    process.exit(0);
});