const { SlashCommandBuilder} = require("discord.js");
const mc = require('node-mcstatus');
const serverInfo = require("../../../serverStatusConfig.json")
const spawn = require("node:child_process").spawn;
const {execFile, exec} = require("node:child_process");
const process = require('process');
const serverStatus = require("./server-status");



let startCooldown = false;


module.exports = {
    cooldown:5,
    data: new SlashCommandBuilder()
        .setName("start-server")
        .setDescription("returns information about the minecraft server"),

    async execute(interaction){
        interaction.reply("this command is temporarly offline until we can integrate it into the server. My dev **Teggatz** was just too lazy to remove it from the listing")


        /*
mc.statusJava(
            `${serverInfo['server-ip']}`,
            serverInfo.port,
            {query : true}
          )
            .then((res) => {
                if(res.online == true){
                    let playerNameList = new Array();
                for(const player of res.players.list){
                    playerNameList.push(player.name_raw)
                }


                interaction.reply(
                    `The server is already Online\n` + 
                    `-------------------------------------\n` + 
                    `Server Status: [**Online**] :green_square:\n` +
                    `Online Players: [${playerNameList}]`
                );
                    return;
                }
                if(startCooldown == true){
                    interaction.reply(
                        "please wait before attempting to start the server again \b" +
                        "we dont want to corrupt server data by opening two instances at once"
                    );
                    return;
                }
                try{
                    startServer(interaction)
                    interaction.reply(
                        `attempting to start server`
                    );
                    startCooldown = true;
                    setTimeout(() => {
                        startCooldown = false;
                    }, 300000);
                } catch (e) {
                    console.error(e);
                    interaction.reply(
                        `**error** : when starting minecraft process\n` +
                        "please contact server manager"
                    );
                }
            })
            .catch((err) => console.log(`error: ${err}`))
        */
    }
}
async function startServer(interaction){
    /*
    execFile(serverInfo["server-file-location"], (errorr, stdout, stderr) => {
        if(errorr){
            console.error(`error starting process: ${errorr.message}`)
            interaction.reply(
                `**error** : when starting minecraft process\n` +
                "please contact server manager"
            );
            return
        }
        
        console.log(stdout)
        interaction.reply(
            `attempting to start server`
        );
        startCooldown = true;
        setTimeout(() => {
            startCooldown = false;
        }, 300000);
    })
    */
    var address = `${serverInfo["server-file-location"]}`
    var cmd = "echo 'hello' && cd '" +  address + "' &&dir && sh 'run.sh'"
    console.log("going ")
    exec(cmd, (err, stdout, stderr) => {
        if(err){
            throw err;
        }
        console.log(stdout);
    })
    
} 