const fs = require("node:fs");
const path = require("node:path");

class database{
    static data = JSON.parse(fs.readFileSync("./../cleanMinecraftData.json", "utf8"));
    static backupTimer = true;


    static getItem(item){
        for(let element of database.data.MuseumDataTable){
            if(element.name === item.toLowerCase()){
                return element
            }
        }
        return null;
    }
    static createBackup(){
        let backupDir = path.join(__dirname, "../backups");
        let backupFolder = fs.readdirSync(backupDir);

        //checks if the latest backup was more then a half a day apart
        if(Date.now() - fs.statSync(`../backups/${backupFolder[backupFolder.length-1]}`).birthtimeMs < 43200000){   
            return;
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
    static updateItem(item, collector, date){

        database.createBackup();
        let selectItem = database.getItem(item);
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

    }
    
}

database.updateItem("air", "teggatz", "6/10/23");
console.log(database.getItem("air"))
database.updateItem("dirt", "teggatz", "6/10/23");
console.log(database.getItem("dirt"))