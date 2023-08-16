import { compileFunc } from "@ton-community/func-js";
import fs from "fs";

const task = 4;
async function main(task) {
    const compileResult = await compileFunc({
        sources: {
            "stdlib.fc": fs.readFileSync('./contracts/imports/stdlib.fc').toString(),
            "4.fc": fs.readFileSync('./contracts/4.fc').toString(),
            "3.fc": fs.readFileSync('./contracts/3.fc').toString(),
            "2.fc": fs.readFileSync('./contracts/2.fc').toString(),
            "1.fc": fs.readFileSync('./contracts/1.fc').toString(),
            "5.fc": fs.readFileSync('./contracts/5.fc').toString()
        },
        entryPoints: ['stdlib.fc', `${task}.fc`],
    })
    if (compileResult.status === 'error') throw new Error(compileResult.message)
    console.log(compileResult.fiftCode);
    fs.writeFile(`./build/${task}.compiled.txt`, compileResult.codeBoc, (e) => { if(e) console.log(e) });
    console.log(`Compiled ${task}.fc`)
}
main(task);