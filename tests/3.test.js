import { SmartContract, stackInt, stackCell, stackTuple} from "ton-contract-executor";
import { Cell, beginCell } from "ton-core";
import assert from "assert";
import fs from "fs";

function messageCell(message){
    let re = beginCell();
    for(let i = 0 ; i < Math.min(message.length, 1023); i++){
        re = re.storeUint(parseInt(message[i], 2), 1);
    }
    if(message.length > 1023) re = re.storeRef(messageCell(message.slice(1023)))
    return re.endCell();
}

function readBitString(cell){
    let re = "";
    let s = cell.asSlice();
    if(s.remainingRefs) re += readBitString(s.loadRef());
    re += s.loadBits(s.remainingBits);
    return re;
}

const task = 3;
async function main() {
    const code = fs.readFileSync(`../build/${task}.compiled.txt`).toString();
    const contract = await SmartContract.fromCell(
        Cell.fromBoc(Buffer.from(code, 'base64'))[0],
        new Cell(),
        { debug: true }
    )
    let flag = "101010", value = "000011";
    let message = flag.repeat(300);
    let correct = message.replaceAll(flag, value);
    let g = messageCell(message);
    console.log(message.length )
    let re = await contract.invokeGetMethod("find_and_replace", 
        [
         stackInt(BigInt('0b' + flag)), 
         stackInt(BigInt('0b' + value)), 
         stackCell(g)
        ]);
    // const c = re.debugLogs.map((a) => a.replace('#DEBUG#: s0 = ', ''));
    // const d = [];
    // for(let i = 0 ; i*2 < c.length; i++) d.push(`${c[2*i]} ${parseInt(c[2*i+1]).toString(2)}`);
    // console.log(d);
    let r = re.result[0];
    correct = messageCell(correct);
    console.log(r.bits);
    console.log(messageCell(correct).bits)
    assert(r.bits.equals(correct.bits));
    console.log(r.bits); console.log(correct.bits);
    while(r.asSlice().remainingRefs){
        r = r.asSlice().loadRef();
        correct = correct.asSlice().loadRef();
        assert(r.bits.equals(correct.bits));
        console.log(r.bits); console.log(correct.bits);
    }
}
main().then(() => {
    console.log("✅ All Tests Passed")
    process.exit(0);
});