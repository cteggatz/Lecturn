const fs = require("node:fs");
const path = require("node:path");

module.exports = class database{
    static data = JSON.parse(fs.readFileSync(__dirname + "\\..\\cleanMinecraftData.json", "utf8", function(err,data) {
        if(err) throw err;
        console.log(__dirname)
    }));
    static backupTimer = true;

    //error handling
    static alreadyCollected(){
        console.error("this item has already been collected")
    }

    //retrieves an item from the database by Name;
    static getItem(item){
        for(let element of database.data.MuseumDataTable){
            if(element.name === item.toLowerCase()){
                return element
            }
        }
        return null;
    }
    //creates a backup of cleanMinecraftData in the backups folder
    static createBackup(){
        /*
            need to refactor backup system to include two folders to hold backups. 
            One daily backup that runs once a day, 
            Another folder containing the last 10 actions.
        */
        let backupDir = path.join(__dirname, "..\\backups");
        let backupFolder = fs.readdirSync(backupDir);

        //checks if the latest backup was more then a half a day apart
        if(backupFolder.length > 0){
            if(Date.now() - fs.statSync(__dirname +`\\..\\backups\\${backupFolder[backupFolder.length-1]}`).birthtimeMs < 43200000){   
                return;
            }
        }
        //finds the oldest file and replaces it or just creates a backup
        if(backupFolder.length > 2){
            let oldest = {
                time: fs.statSync(__dirname +`\\..\\backups\\${backupFolder[0]}`).birthtimeMs,
                obj: backupFolder[0]
            };
            for(let backup of backupFolder){
                let stats = fs.statSync(__dirname +`\\..\\backups\\${backup}`);
                if(stats.birthtimeMs < oldest.time){
                    oldest = {
                        time: stats.birthtimeMs,
                        obj: backup
                    }
                }
            }
            fs.unlinkSync(__dirname +`\\..\\backups\\${oldest.obj}`);
            fs.writeFileSync(
                __dirname +`\\..\\backups\\backup${Date.now()}.json`, 
                JSON.stringify(database.data, null, 2));
        } else {
            fs.writeFileSync(
                __dirname +`\\..\\backups\\backup${Date.now()}.json`, 
                JSON.stringify(database.data, null, 2));
        }
    
    }
    //updates changelog so we can see actions commited to database
    static updateChangeLog(item, collector, date){
        let changeLog = fs.readFileSync(__dirname + "\\..\\metaData\\changeLog.txt", "utf-8");
        fs.writeFileSync(
            __dirname + "\\..\\metaData\\changeLog.txt", 
            `"${collector}" has contributed "${item}" on "${date}"\n${changeLog}`
        )

    }
    static getNumberOfContributed(){
        let done = 0;
        for(let item of database.data.MuseumDataTable){
            if(item.collected == true){
                done++;
            }
        }
        return done;
    }
    static getIndividualContribution(name){
        let done = 0;
        for(let item of database.data.MuseumDataTable){
            if(item.collected == true && item.collector.name == name){
                done++;
            }
        }
        return done;
    }
    //returns a map of all the players that have contributed to the museum and what they have done
    static getPlayerContributions(){
        let players = new Map();

        for(let item of database.data.MuseumDataTable){
            if(item.collected == false)continue;
            let collector = item.collector.name;
            if(players.has(collector)){
                players.set(collector, players.get(collector) + 1)
            } else {
                players.set(collector, 1);
            }
        }
        
        let rtrArray = [...players.entries()].sort((a, b) => {
            return b[1] - a[1]
        });

        return rtrArray
    }
    static getPercentageDone(){return (database.getNumberOfContributed()/database.data.MuseumDataTable.length*100).toFixed(1);}
    static updateItem(item, collector, date){

        database.createBackup();
        let selectItem = database.getItem(item);
        if(selectItem === null){
            throw new Error("Item_Not_Found");
        }
        if(selectItem.collected === true){
            throw new Error(`Already_Contributed`);
        }



        database.updateChangeLog(item, collector, date);
        selectItem.collected = true;
        selectItem.collector = {
            name : collector,
            date : date
        };
        try{
            fs.writeFileSync(__dirname + "\\..\\cleanMinecraftData.json", JSON.stringify(database.data, null, 2));
        } catch(e){
            throw e;
        }
        return true;
    }


    /* ----- catagories -----*/

    //returns a list of all items from a catagory
    static getCatagory(cat){
        let rtnList = new Array();

        for(let el of database.data.MuseumDataTable){
            if(el.catagory === cat){
                rtnList.push(el)
            }
        }


        return rtnList;
    }
    //returns a list off all collected items from a catagory
    static getCollectedCatagory(cat){
        let rtnList = new Array();

        for(let el of database.data.MuseumDataTable){
            if(el.catagory === cat && el.collected == true){
                rtnList.push(el)
            }
        }
        return rtnList;
    }
    
}
