import { SmartContract, stackInt, stackCell} from "ton-contract-executor";
import { Cell, beginCell } from "ton-core";
import assert from "assert";
import { printLogs } from "./helpers.js";
import fs from "fs";


const task = 1;
async function main() {
    const code = fs.readFileSync(`../build/${task}.compiled.txt`).toString();
    const contract = await SmartContract.fromCell(
        Cell.fromBoc(Buffer.from(code, 'base64'))[0],
        new Cell(),
        { debug: true }
    )
    
    const cellToFind = beginCell().storeRef(new Cell()).endCell();
    const root = 
    beginCell().storeRef(
        beginCell()
        .endCell()
    ).storeRef(
        beginCell().storeRef(
            cellToFind
        )
        .endCell()
    )
    .endCell()

    console.log(beginCell().endCell().equals(beginCell().endCell()))
    
    const hash = BigInt('0x' + cellToFind.hash().toString("hex"));
    let re = await contract.invokeGetMethod('find_branch_by_hash', [stackInt(hash), stackCell(root)]);
    console.log(re);
    assert(re.result[0].equals(cellToFind))
}
main().then(() => {
    console.log("✅ All Tests Passed")
    process.exit(0);
});