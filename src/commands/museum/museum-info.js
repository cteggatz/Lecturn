const {SlashCommandBuilder, EmbedBuilder} = require("discord.js");
const database = require('../../../database/databaseFunctions/database');
const nameProxies = require('../../../database/databaseFunctions/nameProxyData')

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
                    .setColor('735D78')
                    .setThumbnail("https://static.wikia.nocookie.net/minecraft_gamepedia/images/9/99/Brush_JE1_BE1.png/revision/latest/thumbnail/width/360/height/360?cb=20230319032249")
                    .addFields(
                        {
                            name: "total completion",
                            value: `${database.getPercentageDone()}% of ${database.data.MuseumDataTable.length} items`
                        }
                ),
                new EmbedBuilder()
                    .setTitle("Catagorical Completion Information")
                    .setColor('735D78')
                    .setThumbnail("https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/edf7da6e-19a0-4f40-bde7-e4c16f105541/d55rh7k-fdda8658-fbee-4042-ad73-5e399aa438f9.png/v1/fill/w_900,h_675/mc_items_expanded_by_jluigijohn_d55rh7k-fullview.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9Njc1IiwicGF0aCI6IlwvZlwvZWRmN2RhNmUtMTlhMC00ZjQwLWJkZTctZTRjMTZmMTA1NTQxXC9kNTVyaDdrLWZkZGE4NjU4LWZiZWUtNDA0Mi1hZDczLTVlMzk5YWE0MzhmOS5wbmciLCJ3aWR0aCI6Ijw9OTAwIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmltYWdlLm9wZXJhdGlvbnMiXX0.-vLHwXm2_m4wGtIQ5DPvw0q3JI--Hu5NjkProNJlEWQ")
                    .addFields(
                        {
                            name: "wood completion",
                            value: `${((database.getCollectedCatagory("wood").length/database.getCatagory("wood").length*100).toFixed(1))}% of ${database.getCatagory("wood").length} blocks`
                            ,inline: true
                        },
                        {
                            name: "color block completion",
                            value: `${((database.getCollectedCatagory("color_block").length/database.getCatagory("color_block").length*100).toFixed(1))}% of ${database.getCatagory("color_block").length} blocks`
                            ,inline: true
                        },
                        {
                            name : " ",
                            value : " "
                        },
                        {
                            name: "head completion",
                            value: `${(database.getCollectedCatagory("head").length/database.getCatagory("head").length*100).toFixed(1)}% of ${database.getCatagory("head").length} heads`
                            ,inline: true
                        },
                        {
                            name: "mob completion",
                            value: `${(database.getCollectedCatagory("mob").length/database.getCatagory("mob").length*100).toFixed(1)}% of ${database.getCatagory("mob").length} mobs`
                            ,inline: true
                        },
                        {
                            name : " ",
                            value : " "
                        },
                        {
                            name: "trim completion",
                            value: `${(database.getCollectedCatagory("trim").length/database.getCatagory("trim").length*100).toFixed(1)}% of ${database.getCatagory("trim").length} trims`
                            ,inline: true
                        },
                        {
                            name: "pottery shard completion",
                            value: `${(database.getCollectedCatagory("shard").length/database.getCatagory("shard").length*100).toFixed(1)}% of ${database.getCatagory("shard").length} shards`
                            ,inline: true
                        },
                        {
                            name : " ",
                            value : " "
                        },
                        {
                            name: "disc completion",
                            value: `${(database.getCollectedCatagory("disc").length/database.getCatagory("disc").length*100).toFixed(1)}% of ${database.getCatagory("disc").length} discs`
                            ,inline: true
                        },
                    )
            )



            await interaction.reply({
                embeds: sendEmbeds
            })
        } else if(subCommand === "leaderboard"){
            //fix order o players
            const leaderboard = new EmbedBuilder()
                .setTitle("Museum Contributions Leaderboard")
                .setDescription("this displays who has contributed the most to our museum")
                .setColor('735D78')
                .setImage(`https://i.ytimg.com/vi/5cmFuA_xfGQ/maxresdefault.jpg`)
            const players = database.getPlayerContributions();
            players.forEach((e) => {
                
                let proxy = (nameProxies.getProxy(e[0])!= null) ? nameProxies.getProxy(e[0]) : e[0]


                leaderboard.addFields(
                    {name: `${proxy}`, value: `total items contributed: [**${e[1]}**]\npercentage of total item: [**${((e[1]/database.data.MuseumDataTable.length)*100).toFixed(2)}%**]`}
                )
            })
            sendEmbeds.push(leaderboard)

            await interaction.reply({
                embeds: sendEmbeds
            })
        }
    }
}