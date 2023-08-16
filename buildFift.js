import fs from "fs";

function main(task) {
    let s = fs.readFileSync(task).toString()
    s = s.replaceAll("    ", "").replaceAll("\r\n", " ");
    let re = Array();
    for(const c of s){
        re.push(c);
    }   
    console.log(s);
}
main("asm/4.fift");