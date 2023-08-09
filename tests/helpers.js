export function printLogs(logs){
    for(let j = 0; j < logs.length; j++){
        if(logs[j].includes("#DEBUG#") || logs[j].includes("error")) console.log(logs[j]);
    }
}