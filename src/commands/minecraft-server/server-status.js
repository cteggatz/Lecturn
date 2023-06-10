const { SlashCommandBuilder} = require("discord.js");
const mc = require('node-mcstatus');
const serverInfo = require("../../../serverStatusConfig.json")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("server-status")
        .setDescription("returns information about the minecraft server"),

    async execute(interaction){
        mc.statusJava(
            `${serverInfo['server-ip']}`,
            serverInfo.port,
            {query : true}
          ).then((results) => {
            interaction.reply(
                `The Server is ${results.online ? `**Online** : [${results.players.list}]` : "**Offline**"}`
            );
          }). catch((err) => {
            console.error("error: " + err);
          })
    }
}