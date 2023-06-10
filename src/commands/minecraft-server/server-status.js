const { SlashCommandBuilder} = require("discord.js");
const mc = require("minecraft-server-status-simple");
const serverInfo = require("../../../serverStatusConfig.json")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("server-status")
        .setDescription("returns information about the minecraft server"),

    async execute(interaction){
        mc.statusJava({
            ip: `${serverInfo["server-ip"]}`,
            port: serverInfo.port,
            show: ["online", "players"]
        })
            .then((res) => {
                interaction.reply(
                    `
                    **Server-Status**: ${res.online ? `Online \n**Players**: [${res.players.list}]` : "Offline"} 
                    `
                )
            })
            .catch((err) => console.log(err))
    }
}