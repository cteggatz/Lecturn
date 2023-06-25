const {SlashCommandBuilder, EmbedBuilder} = require("discord.js");
const database = require('../../../database/databaseFunctions/database');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('museum-info')
        .setDescription("get general information about the Museum and the contributions")
        .addSubcommand(subcommand => subcommand
                .setName("completion")
                .setDescription("returns the percentage of the museum we have completed"))
        .addSubcommand(subcommand => subcommand
                .setName("leaderboard")
                .setDescription("returns a leaderboard of who has contributed the most to the museum"))
        ,
    async execute(interaction){
        const subCommand = interaction.options.getSubcommand();

        const sendEmbeds = []

        if(subCommand === "completion"){
            /*
            in the future, we need to add completion for the different catagories of items in minecraft
            like : [blocks, items, trims, etc]
            */
            sendEmbeds.push(
                new EmbedBuilder()
                    .setTitle("Museum Completion")
                    .setDescription("a display of how much we have completed in the museum database")
                    .setColor('D9E76C')
                    .setThumbnail("https://static.wikia.nocookie.net/minecraft_gamepedia/images/9/99/Brush_JE1_BE1.png/revision/latest/thumbnail/width/360/height/360?cb=20230319032249")
                    .addFields(
                        {
                            name: "total completion",
                            value: `${database.getPercentageDone()}% of ${database.data.MuseumDataTable.length} items`
                        }
                    )
            )



            await interaction.reply({
                embeds: sendEmbeds
            })
        } else if(subCommand === "leaderboard"){
            const leaderboard = new EmbedBuilder()
                .setTitle("Museum Contributions Leaderboard")
                .setDescription("this displays who has contributed the most to our museum")
                .setColor('D9E76C')
                .setImage(`https://i.ytimg.com/vi/5cmFuA_xfGQ/maxresdefault.jpg`)
            const players = database.getPlayerContributions();
            players.forEach((e) => {
                leaderboard.addFields(
                    {name: `${e[0]}`, value: `total items contributed: [**${e[1]}**]\npercentage of total item: [**${((e[1]/database.data.MuseumDataTable.length)*100).toFixed(2)}**]`}
                )
            })
            sendEmbeds.push(leaderboard)

            await interaction.reply({
                embeds: sendEmbeds
            })
        }
    }
}