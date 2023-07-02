const {SlashCommandBuilder, EmbedBuilder, inlineCode} = require("discord.js");
const database = require('../../../database/databaseFunctions/database');
const nameProxies = require('../../../database/databaseFunctions/nameProxyData')
//add ability to see other peoples membership profile

module.exports = {
    data: new SlashCommandBuilder()
        .setName("membership")
        .setDescription("allows you to edit and view your stats / stored info about you in our database")
        .addSubcommand(subcommand => 
            subcommand
                .setName("edit_name")
                .setDescription("allows you to edit your name in the database if you dont like your discord username")
                .addStringOption( option => 
                    option
                        .setName("name")
                        .setDescription("the proxy that will be used over your discord username")
                        .setRequired(true)
                    )
                )
        .addSubcommand(subcommand =>
            subcommand
                .setName("list")
                .setDescription("lists out all of your stats stored in the database")
            )
    ,
    async execute(interaction){
        const command = interaction.options.getSubcommand()

        if(command === "edit_name"){
            const name = interaction.options.getString("name").trim();

            nameProxies.addProxie(interaction.user.username, name);
            

            await interaction.reply({
                content: `set your user name "${interaction.user.username}" in the database to "${name}"`,
                ephemeral: true
            });
            return;
        } else if(command === "list"){
            let proxyName = (nameProxies.getProxy(interaction.user.username) != null) ? nameProxies.getProxy(interaction.user.username) : interaction.user.username;

            //gets all of the player contributions
            let catagoryContributions = new Map();
            for(let el of database.data.MuseumDataTable){
                if(el.catagory == null || el.collected == false || el.collector.name != interaction.user.username)continue;
                if(catagoryContributions.has(el.catagory)){
                    catagoryContributions.set(el.catagory, catagoryContributions.get(el.catagory) + 1);
                } else {
                    catagoryContributions.set(el.catagory, 1);
                }
            }
            //console.log(catagoryContributions)
            const catagoryEmbed = new EmbedBuilder()
                .setTitle("Spesific Data")
                .setColor('F7D1CD')

            catagoryContributions.forEach( (val, key) => {
                catagoryEmbed.addFields(
                    {
                        name: `${key} contributions`,
                        value: `${(val/database.getCatagory(key).length*100).toFixed(1)}% of ${database.getCatagory(key).length} items`,
                        inline: true
                    }
                )
            })

            await interaction.reply({
                embeds:[
                    new EmbedBuilder()
                        .setTitle(`"**${proxyName}**" Membership Information`)
                        .setAuthor({
                            name: `Discord User : ${interaction.user.username}`,
                            iconURL: `${interaction.user.avatarURL()}`
                        })
                        .setColor('F7D1CD')
                        .setThumbnail(`https://static.wikia.nocookie.net/minecraft_gamepedia/images/3/31/Enchanting_Table.gif/revision/latest?cb=20220222115558`)
                        .setDescription("here is a recap of some of your information stored in the database"),
                    new EmbedBuilder()
                        .setTitle("General Data")
                        .setColor('F7D1CD')
                        .addFields(
                            {
                                name: "Ammount of Contribued Items",
                                value: `${database.getIndividualContribution(`${interaction.user.username}`)} of ${database.data.MuseumDataTable.length} items`,
                                inline: true
                            },
                            {
                                name: "Ammount vs Contribued Items",
                                value: `${database.getIndividualContribution(`${interaction.user.username}`)} of ${database.getNumberOfContributed()} items`,
                                inline: true
                            },
                            { name: ' ', value: ' ' },
                            {
                                name: "Percentage vs Database",
                                value: `${(database.getIndividualContribution(`${interaction.user.username}`)/database.data.MuseumDataTable.length*100).toFixed(2)}% of ${database.data.MuseumDataTable.length} items`,
                                inline: true
                            },
                            {
                                name: "Percentage vs Contributed Items",
                                value: `${(database.getIndividualContribution(`${interaction.user.username}`)/database.getNumberOfContributed()*100).toFixed(2)}% of ${database.getNumberOfContributed()} items`,
                                inline: true
                            }
                        ),
                        catagoryEmbed
                ],
                ephemeral: true
            })
        }



    }
}