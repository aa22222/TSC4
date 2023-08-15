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
function caeserCipher(str, amount) {
    // Wrap the amount
    if (amount < 0) {
      return caeserCipher(str, amount + 26);
    }
  
    // Make an output variable
    var output = "";
  
    // Go through each character
    for (var i = 0; i < str.length; i++) {
      // Get the character we'll be appending
      var c = str[i];
  
      // If it's a letter...
      if (c.match(/[a-z]/i)) {
        // Get its code
        var code = str.charCodeAt(i);
  
        // Uppercase letters
        if (code >= 65 && code <= 90) {
          c = String.fromCharCode(((code - 65 + amount) % 26) + 65);
        }
  
        // Lowercase letters
        else if (code >= 97 && code <= 122) {
          c = String.fromCharCode(((code - 97 + amount) % 26) + 97);
        }
      }
  
      // Append
      output += c;
    }
  
    // All done!
    return output;
};
const task = 4;
async function main() {
    const code = fs.readFileSync(`../build/${task}.compiled.txt`).toString();
    const contract = await SmartContract.fromCell(
        Cell.fromBoc(Buffer.from(code, 'base64'))[0],
        new Cell(),
        { debug: true }
    )
    const msg = "abcd~(&)(*$&)!@($*--___-^#)(@*!YR(UHSAKLFJefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".repeat(30);
    const cell = beginCell().storeUint(0, 32).storeStringTail(msg).endCell();
    
    for(let i = 25; i <= 25; i++){
        let re = await contract.invokeGetMethod("caesar_cipher_encrypt", [stackInt(i), stackCell(cell)]);
        console.log(readSimpleMessageCell(re.result[0]))
        console.log(caeserCipher(msg, i))
        assert(readSimpleMessageCell(re.result[0]) == caeserCipher(msg, i));
        let re2 = await contract.invokeGetMethod("caesar_cipher_decrypt", [stackInt(i), stackCell(simpleMessageCell(caeserCipher(msg, i)))]);
        // console.log(readSimpleMessageCell(re2.result[0]))
        // console.log(re2.result[0])
        // console.log(re.result[0])
        
        // console.log(msg)
        assert(readSimpleMessageCell(re2.result[0]) == msg);
        console.log(i);
    }
    // console.log(re.logs);
    // printLogs(re.debugLogs);
    // console.log("Gas Consumed: %d", re.gas_consumed);
}
main().then(() => {
    console.log("✅ All Tests Passed")
    process.exit(0);
});