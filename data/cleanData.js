const fs = require("node:fs")
const colors = require("colors");

let data;
let pushData = {
    MinecraftBlocks: new Array()
}
try{
    data = fs.readFileSync("./minecraftBlocks.txt", "utf8")
} catch (err) {
    console.log(err)
}
let wordCatch = 0;
for(let i = 0; i < data.length; i++){
    if(data.charAt(i) == "	"){
        wordCatch++;
        continue;
    }
    if(wordCatch==1){
        let wordLen = 0;
        let charCatch = false;
        while(charCatch ==false){
            if(data.charAt(i+wordLen) == " "){
                charCatch = true;
                break;
            }
            wordLen++;
        }
        const word = data.substring(i, i+wordLen);
        if(word.includes("#") || word.includes("_egg")){
            console.log(`index: ${i} | word: ${data.substring(i, i+wordLen)} | ` + " ignoring".red)
            
        } else {
            console.log(`index: ${i} | word: ${data.substring(i, i+wordLen)}`)
            pushData.MinecraftBlocks.push(
                {
                    name: data.substring(i, i+wordLen),
                    colleted: false,
                    collector: null
                }
            );
        }
        wordCatch=-1;
    }
}
let outJSON = JSON.stringify(pushData, null, 2);
try{
    fs.writeFileSync("cleanMinecraftData.json", outJSON);
    console.log("fileCreated")
} catch (e){
    console.error(e);
}