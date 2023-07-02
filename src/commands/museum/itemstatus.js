const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const database = require('../../../database/databaseFunctions/database');
const stringSimilarity = require("string-similarity")


module.exports = {
    data: new SlashCommandBuilder()
        .setName("item_status")
        .setDescription("pings a item in the database to see if it has already been contributed or not")
        .addStringOption(option => 
            option
                .setName("item")
                .setDescription("the item you want to find")
                .setRequired(true)
        )
    ,
    async execute(interaction){
        const item = interaction.options.getString("item").trim();

        const itemInformation = database.getItem(item);

        if(itemInformation === null){
            let findSimolarity = database.data.MuseumDataTable.map(item => {
                return item.name
            })

            await interaction.reply({
                content: `"**${item}**" was not found in the database, perhapse you mean [**${stringSimilarity.findBestMatch(item, findSimolarity).bestMatch.target}**]`,
                ephemeral: true
            })
            return;
        }

        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`${itemInformation.name}`)
                    .setColor('E8C2CA')
                    .setDescription(`item catagory: ${(itemInformation.catagory === null) ? `none` : itemInformation.catagory}`)
                    .setFields(
                        {
                            name: `Contributer: ${itemInformation.collector.name}`,
                            value: `collection date: ${itemInformation.collector.date}`
                        }
                    )
            ],
            ephemeral: true
        })


    }
}