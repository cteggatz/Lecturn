const {SlashCommandBuilder} = require("discord.js");

module.exports = {
    data : new SlashCommandBuilder()
    .setName("ping")
    .setDescription("replies with pong"),

    async execute(interaction){
        //console.log(interaction)
        await interaction.reply(`${interaction.user.avatarURL()}`)
    }
}