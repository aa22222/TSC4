import { SmartContract, stackInt, stackCell} from "ton-contract-executor";
import { Cell, beginCell } from "ton-core";
import assert from "assert";
import { printLogs } from "./helpers.js";
import fs from "fs";

function simpleMessageCell(msg){
    return beginCell().storeUint(0, 32).storeStringTail(msg).endCell()
}
function readSimpleMessageCell(cell){
    return cell.asSlice().skip(32).loadStringTail();
}
function caeserCipher(msg, i){
    let re = "";
    for(const c of msg){
        re += String.fromCharCode(65 + (c.charCodeAt(0) - 65 + i + 26) % 26);
    }
    return re;
}
const task = 4;
async function main() {
    const code = fs.readFileSync(`../build/${task}.compiled.txt`).toString();
    const contract = await SmartContract.fromCell(
        Cell.fromBoc(Buffer.from(code, 'base64'))[0],
        new Cell(),
        { debug: true }
    )
    const msg = "TESTMSG";
    const cell = simpleMessageCell(msg);

    for(let i = 0; i < 26; i++){
        let re = await contract.invokeGetMethod("caesar_cipher_encrypt", [stackInt(i), stackCell(cell)]);
        assert(readSimpleMessageCell(re.result[0]) == caeserCipher(msg, i));
        let re2 = await contract.invokeGetMethod("caesar_cipher_decrypt", [stackInt(i), stackCell(re.result[0])]);
        assert(readSimpleMessageCell(re2.result[0]) == msg);
    }
    // console.log(re.logs);
    // printLogs(re.debugLogs);
    // console.log("Gas Consumed: %d", re.gas_consumed);
}
main().then(() => {
    console.log("✅ All Tests Passed")
    process.exit(0);
});