const fs = require("node:fs")
const colors = require("colors");


let data;
let pushData = {
    MuseumDataTable: new Array()
}

//goes through text database and writes JSON data to pushData
try{
    data = fs.readFileSync("./../raw/minecraftBlocks.txt", "utf8")
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
                    collected: false,
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
            collected: false,
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
let update20 = ["Bambooa_Mosaic", "Bamboo_Planks", "Block_of_Bamboo", "Calibrated_Sculk_Sensor", "Cherry_Leaves", "Cherry_Log", " Cherry_Planks", "Cherry_Sapling", "Chiseled_Bookshelf", "Decorated_Pot",
"Oak_Hanging_Sign", "Spruce_Hanging_Sign", "Birch_Hanging_Sign", "Jungle_Hanging_Sign", "Acacia_Hanging_Sign", "Dark_Oak_Hanging_Sign", "Mangrove_Hanging_Sign", "Crimson_Hanging_Sign", "Warped_Hanging_Sign", "Bamboo_Hanging_Sign", "Cherry_Hanging_Sign",
"Piglen_Head", "Pink_Petals", "Pitcher_Plant", "Sniffer_Egg", "Torchflower", "Brush", "Relic", "Pitcher_Pod", 
"Angler_Pottery_Sherd","Archer_Pottery_Sherd","Arms_up_Pottery_Sherd","Blade_Pottery_Sherd","Brewer_Pottery_Sherd","Burn_Pottery_Sherd","Danger_Pottery_Sherd","Explorer_Pottery_Sherd","Friend_Pottery_Sherd","Heart_Pottery_Sherd","Heartbreak_Pottery_Sherd","Howl_Pottery_Sherd","Miner_Pottery_Sherd","Mourner_Pottery_Sherd","Plenty_Pottery_Sherd","Prize_Pottery_Sherd","Sheaf_Pottery_Sherd","Shelter_Pottery_Sherd","Skull_Pottery_Sherd","Snort_Pottery_Sherd",
"Netherite_Upgrade","Coast_Armor_Trim", "Dune_Armor_Trim","Eye_Armor_Trim","Host_Armor_Trim","Raiser_Armor_Trim","Rib_Armor_Trim","Sentry_Armor_Trim","Shaper_Armor_Trim","Silence_Armor_Trim","Spire_Armor_Trim","Snout_Armor_Trim","Tide_Armor_Trim","Vex_Armor_Trim","Ward_Armor_Trim","Wayfinder_Armor_Trim"," Wild_Armor_Trim",
"Torchflower_Seeds", "Cherry_boat", "Raft"]
update20.forEach((e) => {
    pushData.MuseumDataTable.push(
        {
            name: `${e.toLocaleLowerCase()}`,
            collected: false,
            collector: {
                name: null,
                date: null
            }
        }
    ); 
})
//turns push data object into a JSON string to be written to the file
let outJSON = JSON.stringify(pushData, null, 2);
try{
    fs.writeFileSync("../cleanMinecraftData.json", outJSON);
    console.log("fileCreated")
} catch (e){
    console.error(e);
}
