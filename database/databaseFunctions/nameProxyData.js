
const fs = require("node:fs")



module.exports = class nameProxies{
    static data = JSON.parse(fs.readFileSync(__dirname + "\\..\\metaData\\nameProxies.json", "utf-8", (err) => {
        if(err) throw err;
    }))

    static addProxie(name, proxy){
        
        if(nameProxies.getProxy(name) != null){
            for(let obj of nameProxies.data.names){
                if(obj.name == name){
                    obj.proxy = proxy;
                    nameProxies.updateFile();

                    nameProxies.updateChangeLog(name, proxy);

                    return true;
                }
            }
            return false;
        } else {
            nameProxies.data.names.push(
                {name: name, proxy: proxy}
            )
            nameProxies.updateFile();
            nameProxies.updateChangeLog(name, proxy);
            return true;
        }
 

    
    }
    static updateChangeLog(name, proxy){
        const date = new Date();
        const currDate = `[${date.getDay()}/${date.getMonth()}/${date.getFullYear()}]`
        let changeLog = fs.readFileSync(__dirname + "\\..\\metaData\\changeLog.txt", "utf-8");
        fs.writeFileSync(
            __dirname + "\\..\\metaData\\changeLog.txt", 
            `"${name}" has changed proxy to "${proxy}" on "${currDate}"\n${changeLog}`
        )
    }
    static getProxy(name){
        for(let proxy of nameProxies.data.names){
            if(proxy.name === name) return proxy.proxy;
        }
        return null;
    }
    static updateFile(){
        fs.writeFileSync(__dirname + "\\..\\metaData\\nameProxies.json", JSON.stringify(nameProxies.data, null, 2))
    }
}