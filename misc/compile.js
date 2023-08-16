import { compileFunc } from "@ton-community/func-js";
import fs from "fs";

async function main(task) {
    const compileResult = await compileFunc({
        sources: {
            "test.fc": fs.readFileSync('test.fc').toString(),
        },
        entryPoints: [`${task}.fc`],
    })
    if (compileResult.status === 'error') throw new Error(compileResult.message)
    console.log(compileResult.fiftCode);
    console.log(`Compiled ${task}.fc`)
}
main("test");