const fs = require("node:fs")
const colors = require("colors");


let data;
let pushData = {
    MuseumDataTable: new Array()
}

//goes through text database and writes JSON data to pushData
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
        if(word.includes("#") || word.includes("_spawn_egg") || word.includes("potion") || word.includes("tipped_arrow")){
            console.log(`index: ${i} | word: ${data.substring(i, i+wordLen)} | ` + " ignoring".red)
            
        } else {
            //console.log(`index: ${i} | word: ${data.substring(i, i+wordLen)}`)
            pushData.MuseumDataTable.push(
                {
                    name: data.substring(i, i+wordLen),
                    colleted: false,
                    collector: {
                        name: null,
                        date: null
                    }
                }
            );
        }
        wordCatch=-1;
    }
}
//adds potions, the differente variants, and the arrows to the table
let potionEffects = [
    "Healing", "Strength", "Fire_Resistance", "Swiftness", "Night_Vision", "Invisibility", "Water_Breathing", "Leaping", "Slow_Falling", "Poison", "Weakness", "Harming", "Slowness", "the_Turtle_Master"
];
potionEffects.forEach(e => {
    pushData.MuseumDataTable.push(
        {
            name: `potion_of_${e.toLocaleLowerCase()}`,
            colleted: false,
            collector: {
                name: null,
                date: null
            }
        }
    );
    pushData.MuseumDataTable.push(
        {
            name: `splash_potion_of_${e.toLocaleLowerCase()}`,
            colleted: false,
            collector: {
                name: null,
                date: null
            }
        }
    );
    pushData.MuseumDataTable.push(
        {
            name: `lingering_potion_of_${e.toLocaleLowerCase()}`,
            colleted: false,
            collector: {
                name: null,
                date: null
            }
        }
    );
    pushData.MuseumDataTable.push(
        {
            name: `arrow_of_${e.toLocaleLowerCase()}`,
            colleted: false,
            collector: {
                name: null,
                date: null
            }
        }
    );
})
//adds blocks from 1.20


//turns push data object into a JSON string to be written to the file
let outJSON = JSON.stringify(pushData, null, 2);
try{
    fs.writeFileSync("cleanMinecraftData.json", outJSON);
    console.log("fileCreated")
} catch (e){
    console.error(e);
}
