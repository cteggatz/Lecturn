const fs = require("node:fs");
const path = require("node:path");

class database{
    static data = JSON.parse(fs.readFileSync("./../cleanMinecraftData.json", "utf8"));
    static backupTimer = true;

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
        let backupDir = path.join(__dirname, "../backups");
        let backupFolder = fs.readdirSync(backupDir);

        //checks if the latest backup was more then a half a day apart
        if(backupFolder.length > 0){
            if(Date.now() - fs.statSync(`../backups/${backupFolder[backupFolder.length-1]}`).birthtimeMs < 43200000){   
                return;
            }
        }
        //finds the oldest file and replaces it or just creates a backup
        if(backupFolder.length > 2){
            let oldest = {
                time: fs.statSync(`../backups/${backupFolder[0]}`).birthtimeMs,
                obj: backupFolder[0]
            };
            for(let backup of backupFolder){
                let stats = fs.statSync(`../backups/${backup}`);
                if(stats.birthtimeMs < oldest.time){
                    oldest = {
                        time: stats.birthtimeMs,
                        obj: backup
                    }
                }
            }
            fs.unlinkSync(`../backups/${oldest.obj}`);
            fs.writeFileSync(
                `../backups/backup${Date.now()}.json`, 
                JSON.stringify(database.data, null, 2));
        } else {
            fs.writeFileSync(
                `../backups/backup${Date.now()}.json`, 
                JSON.stringify(database.data, null, 2));
        }
    
    }
    //updates changelog so we can see actions commited to database
    static updateChangeLog(item, collector, date){
        let changeLog = fs.readFileSync("./../metaData/changeLog.txt", "utf-8");
        fs.writeFileSync(
            "./../metaData/changeLog.txt", 
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
    //returns a map of all the players that have contributed to the museum and what they have done
    static getPlayerContributions(){
        let players = new Map();

        for(let item of database.data.MuseumDataTable){
            if(item.collected == false)continue;
            let collector = item.collector.name;
            if(players.has(collector)){
                console.log(item.name)
                players.set(collector, players.get(collector) + 1)
            } else {
                console.log(item.name)
                players.set(collector, 1);
            }
        }
        return players;
    }
    static getPercentageDone(){return (database.getNumberOfContributed()/database.data.MuseumDataTable.length*100).toFixed(2);}
    static updateItem(item, collector, date){

        database.createBackup();
        let selectItem = database.getItem(item);
        if(selectItem === null)return null;
        if(selectItem.collected != true){
            database.updateChangeLog(item, collector, date);
            selectItem.collected = true;
            selectItem.collector = {
                name : collector,
                date : date
            };
            try{
                fs.writeFileSync("../cleanMinecraftData.json", JSON.stringify(database.data, null, 2));
            } catch(e){
                throw e;
            }
            return true;
        } else {
            return null;
        }
    }
    
}

database.updateItem("dirt", "teggatz", "6/15");
database.updateItem("gravel", "teggatz", "6/15")
database.updateItem("blb", "teggatz", "6/15")


console.log(JSON.stringify(database.getPlayerContributions(), (key, value) => (value instanceof Map ? [...value] : value)))