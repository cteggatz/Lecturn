const { SlashCommandBuilder} = require("discord.js");
const mc = require("minecraft-server-status-simple");
const serverInfo = require("../../../serverStatusConfig.json")
const spawn = require("node:child_process").spawn;
const {execFile, exec} = require("node:child_process");
const process = require('process');
const serverStatus = require("./server-status");



let startCooldown = false;


module.exports = {
    data: new SlashCommandBuilder()
        .setName("start-server")
        .setDescription("returns information about the minecraft server"),

    async execute(interaction){
        mc.statusJava({
            ip: `${serverInfo["server-ip"]}`,
            port: serverInfo.port,
            show: ["online", "players"]
        })
            .then((res) => {
                if(res.online != true){
                    interaction.reply(
                        "server is already online\n" +
                        `**Players** : [${res.players.list}]`
                    )
                    return;
                }
                if(startCooldown == true){
                    interaction.reply(
                        "please wait before attempting to start the server again \b" +
                        "we dont want to corrupt server data by opening two instances at once"
                    );
                    return;
                }
                startServer(interaction)
            })
            .catch((err) => console.log(`error: ${err}`))
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
    const cmd = `echo hello &&
    ${serverInfo["server-file-location"]}\\..
    ls
    bash run.bat
    `
    console.log("going ")
    exec(cmd, (err, stdout, stderr) => {
        if(err)console.log(err)
        console.log(stdout);
    })
}