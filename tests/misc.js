let re=  "";
// for(let i = 0 ; i < 255; i++){
//     re += "int a"+i+", ";
// }
// console.log(re);

let fib = [BigInt(0), BigInt(1)];
    for(let i = 0; i < 400; i++){
        fib.push(fib[fib.length - 1] + fib[fib.length - 2]);
    }
    
for(let i = 0; i < 255; i++){
    re += "t~tpush(" + fib[i].toString() + "); ";
}
for(let i = 255; i < 371; i++){
    re += "t2~tpush(" + fib[i].toString() + "); ";
}
console.log(re);