const {SlashCommandBuilder} = require('discord.js');
const database = require('../../../database/databaseFunctions/database');


module.exports = {
    data: new SlashCommandBuilder()
        .setName("contribute")
        .setDescription("Contribute something to our servers museum where it will be displayed")
        .addStringOption(option => 
            option
                .setName("target")
                .setDescription("the tag of the item you want to contribute")
                .setRequired(true))
        ,
    async execute(interaction){
        const item = interaction.options.getString("target").toLowerCase().trim();
        const user = interaction.user.username;
        const date = new Date();
        const currDate = `[${date.getDay()}/${date.getMonth()}/${date.getFullYear()}]`

        try{
            database.updateItem(item, user, currDate);
            await interaction.reply(
                {
                    content: `**"${interaction.user.username}"** has contributed **"${item}"** on **[${date.getDay()}/${date.getMonth()}/${date.getFullYear()}]**`,
                    ephemeral: true
                }
                )
        } catch(e){
            //console.error(e)
            if(e.message === "Item_Not_Found"){
                await interaction.reply({
                    content: `"${item}" was not found in the library database.\nContact an Admin or change your response in accordance to the in-game machine collumn in this database\n [https://mcreator.net/wiki/minecraft-block-and-item-list-registry-and-code-names]`,
                    ephemeral: true
                })
            }else if(e.message === "Already_Contributed"){
                let databaseItem = database.getItem(item)
                await interaction.reply({
                    content: `"${item}" was already contributed by "${databaseItem.collector.name}" on ${databaseItem.collector.date}`,
                    ephemeral: true
                })
            } else {
                await interaction.reply({
                    content: `There was an **error** processing your donation.\ntry changing how you typed your item or contacting an admin`,
                    ephemeral: true
                })
            }
        }   
    }
}