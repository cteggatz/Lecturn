const { SlashCommandBuilder} = require("discord.js");
const mc = require('node-mcstatus');
const serverInfo = require("../../../serverStatusConfig.json")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("server-status")
        .setDescription("returns information about the minecraft server"),

    async execute(interaction){
      await interaction.deferReply()
      try{
        let results = await mc.statusJava(`${serverInfo['server-ip']}`, serverInfo.port,{query : true});
        if(!results.online){
          await interaction.editReply(`Server Status: [**Offline**] :red_square:`);
          return;
        }
        let playerNameList = new Array();
        for(const player of results.players.list){
          playerNameList.push(player.name_raw)
        }
        await interaction.editReply(
          `Server Status: [**Online**] :green_square:\n` +
          `Online Players: [${playerNameList}]`
        );     
        return;
      } catch(error){
        await interaction.editReply("there was an error pinging the server")
        console.log(error)
      }

    }
}