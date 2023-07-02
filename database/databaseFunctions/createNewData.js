const fs = require("node:fs")
const colors = require("colors");


let data;
let pushData = {
    MuseumDataTable: new Array()
}

function createData(name, catagory){
    return {
        name: name,
        collected: false,
        collector: {
            name: null,
            date: null
        },
        catagory: catagory
    }
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
        if(word.includes("#") || 
        word.includes("_spawn_egg") || 
        word.includes("potion") || 
        word.includes("tipped_arrow") || 
        word.includes("_air") || 
        word === "air" ||
        word.includes("infested_") ||
        word.includes("end_portal") ||
        word.includes("end_gateway") ||
        word.includes("_wall_skull") ||
        word.includes("_wall_head") ||
        word.includes("wall_torch") ||
        word.includes("potted_") ||
        word.includes("bundle") ||
        word.includes("potted_") ||
        word.includes("spawner") ||
        word.includes("petrified_oak_slab") ||
        word.includes("_wall_banner") ||
        word.includes("_wall_sign")){
            console.log(`index: ${i} | word: ${data.substring(i, i+wordLen)} | ` + " ignoring".red)
        } else {
            //console.log(`index: ${i} | word: ${data.substring(i, i+wordLen)}`)

            if(word.includes("oak") || 
            word.includes("spruce") ||
            word.includes("birch") ||
            word.includes("acacia") ||
            word.includes("jungle") ||
            word.includes("dark_oak") ||
            word.includes("crimson") ||
            word.includes("warped") ||
            word.includes("mangrove")){
                pushData.MuseumDataTable.push(createData(data.substring(i, i+wordLen), "wood"))
            } else if(word.includes("_head") || word.includes("_skull")){
                pushData.MuseumDataTable.push(createData(data.substring(i, i+wordLen), "head"))
            } else if(word.includes("music_disc")){
                pushData.MuseumDataTable.push(createData(data.substring(i, i+wordLen), "disc"))
            }else if(
                word.includes("carpet") ||
                word.includes("wool") ||
                word.includes("concrete") ||
                word.includes("terracotta") ||
                word.includes("candle") ||
                word.includes("stained_glass") ||
                word.includes("bed") ||
                (word.includes("banner") && !word.includes("banner_"))||
                word.includes("shulker_box") ||
                word.includes("dye")
                ){
                pushData.MuseumDataTable.push(createData(data.substring(i, i+wordLen), "color_block"))
            }else {
                pushData.MuseumDataTable.push(createData(data.substring(i, i+wordLen), null))
            }
        }
        wordCatch=-1;
    }
}
//adds potions, the differente variants, and the arrows to the table
let potionEffects = [
    "Healing", "Strength", "Fire_Resistance", "Swiftness", "Night_Vision", "Invisibility", "Water_Breathing", "Leaping", "Slow_Falling", "Poison", "Weakness", "Harming", "Slowness", "the_Turtle_Master"
];
potionEffects.forEach(e => {
    pushData.MuseumDataTable.push(createData(`potion_of_${e.toLocaleLowerCase()}`, "potion"));
    pushData.MuseumDataTable.push(createData(`splash_potion_of_${e.toLocaleLowerCase()}`, "potion"));
    pushData.MuseumDataTable.push(createData(`lingering_potion_of_${e.toLocaleLowerCase()}`, "potion"));
    pushData.MuseumDataTable.push(createData(`arrow_of_${e.toLocaleLowerCase()}`, "potion"));
})
//adds blocks from 1.20
let update20 = [ "Calibrated_Sculk_Sensor", "Chiseled_Bookshelf", "Decorated_Pot",
"Piglen_Head", "Pink_Petals", "Pitcher_Plant", "Sniffer_Egg", "Potted_Torchflower", "Brush", "Pitcher_Pod",
"Torchflower_Seeds", "suspicious_"]
update20.forEach((e) => {pushData.MuseumDataTable.push(createData(`${e.toLocaleLowerCase()}`, null)) })
pushData.MuseumDataTable.push(createData(`music_disc_relic`, 'disc'));

let update20Woods = [
    "Cherry_Leaves", "Cherry_Log", "Bamboo_Raft_with_Chest", " Cherry_Planks", "Cherry_Sapling","Bamboo_Mosaic", "Bamboo_Mosaic_Stairs","Bamboo_Mosaic_slab","Bamboo_Planks","Cherry_boat","Cherry_chest_boat", "Block_of_Bamboo","Bamboo_Stairs","Bamboo_Slab","Bamboo_Door","Bamboo_Fence","Bamboo_Fence_Gate","Bamboo_Trapdoor","Bamboo_preasure_plate","Bamboo_button","Bamboo_sign","Stripped_Block_of_Bamboo","Oak_Hanging_Sign", "Spruce_Hanging_Sign", "Birch_Hanging_Sign", "Jungle_Hanging_Sign", "Acacia_Hanging_Sign", "Dark_Oak_Hanging_Sign", "Mangrove_Hanging_Sign", "Crimson_Hanging_Sign", "Warped_Hanging_Sign", "Bamboo_Hanging_Sign", "Cherry_Hanging_Sign",
]
update20Woods.forEach(e=> pushData.MuseumDataTable.push(createData(`${e.toLocaleLowerCase()}`, "wood")));

let shards = ["Angler_Pottery_Shard","Archer_Pottery_Shard","Arms_up_Pottery_Shard","Blade_Pottery_Shard","Brewer_Pottery_Shard","Burn_Pottery_Shard","Danger_Pottery_Shard","Explorer_Pottery_Shard","Friend_Pottery_Shard","Heart_Pottary_Shard","Heartbreak_Pottery_Shard","Howl_Pottery_Shard","Miner_Pottery_Shard","Mourner_Pottery_Shard","Plenty_Pottery_Shard","Prize_Pottery_Shard","Sheaf_Pottery_Shard","Shelter_Pottery_Shard","Skull_Pottery_Shard","Snort_Pottery_Shard"]
shards.forEach( e => {pushData.MuseumDataTable.push(createData(`${e.toLocaleLowerCase()}`, "shard"))})

let trims = ["Netherite_Upgrade","Coast_Armor_Trim", "Dune_Armor_Trim","Eye_Armor_Trim","Host_Armor_Trim","Raiser_Armor_Trim","Rib_Armor_Trim","Sentry_Armor_Trim","Shaper_Armor_Trim","Silence_Armor_Trim","Spire_Armor_Trim","Snout_Armor_Trim","Tide_Armor_Trim","Vex_Armor_Trim","Ward_Armor_Trim","Wayfinder_Armor_Trim"," Wild_Armor_Trim"];
trims.forEach( e => { pushData.MuseumDataTable.push(createData(`${e.toLocaleLowerCase()}`, "trim"))})

//heads
let headData = JSON.parse(fs.readFileSync(__dirname + "\\..\\raw\\headDump.json"))
headData.forEach( e => pushData.MuseumDataTable.push(createData(`${e.toLocaleLowerCase()}`, 'head')))
headData.forEach( e => pushData.MuseumDataTable.push(createData(`${e.substring(0, e.length-5).toLocaleLowerCase()}`, 'mob')))
//need to add variations for sheep, villager, zombie villagers, panda, cats
//dont forget to include wither heads

//need to add variations for the got goat horns and each of the enchantment books
let goatHorns = ["ponder_goat_horn", "sing_goat_horn","seek_goat_horn","feel_goat_horn", "admire_goat_horn", "call_goat_horn", "yearn_goat_horn", "dream_goat_horn",];
goatHorns.forEach(e=> {
    pushData.MuseumDataTable.push(createData(e, "goatHorn"))
})

let enchantmentBooks = new Map()
    .set("Aqua_Affinity", 1)
    .set("Bane_of_Arthropods",5)
    .set("Blast Protection",4)
    .set("Channeling",1)
    .set("Curse of Binding",1)
    .set("Curse of Vanishing",1)
    .set("Depth Strider",3)
    .set("Efficiency",5)
    .set("Feather Falling",4)
    .set("Fire Aspect",2)
    .set("Fire Protection",4)
    .set("Flame",1)
    .set("Fortune",3)
    .set("Frost Walker",2)
    .set("Impaling",5)
    .set("Infinity",1)
    .set("Knockback",2)
    .set("Looting",3)
    .set("Loyalty",3)
    .set("Luck off the sea",3)
    .set("lure",3)
    .set("mending",1)
    .set("multishot",1)
    .set("piercing",4)
    .set("power",5)
    .set("Projectile Protection",4)
    .set("Protection",4)
    .set("Punch",2)
    .set("Quick Charge",3)
    .set("Respiration",3)
    .set("Riptide",3)
    .set("sharpness",5)
    .set("silk touch",1)
    .set("smite",5)
    .set("soul speed",3)
    .set("sweeping edge",3)
    .set("swift sneak",3)
    .set("thorns",3)
    .set("unbreaking",3)
enchantmentBooks.forEach((value, key) => {
    for(let i = 1; i <= value; i++){
        pushData.MuseumDataTable.push(createData(`${key.replaceAll(" ", "_").toLocaleLowerCase()}_${i}_book`, "enchantingBooks"))
    }
})


//turns push data object into a JSON string to be written to the file
let outJSON = JSON.stringify(pushData, null, 2);
try{
    fs.writeFileSync("../cleanMinecraftData.json", outJSON);
    console.log("fileCreated")
} catch (e){
    console.error(e);
}
