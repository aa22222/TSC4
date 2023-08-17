import fs from "fs";

function main(task) {
    let s = fs.readFileSync(task).toString()
    s = s.replaceAll("    ", "").replaceAll("\r\n", " ");
    console.log(s);
}
main("asm/1.fift");