const fs = require("node:fs");
const path = require("node:path");
const {Client, Events, GatewayIntentBits, Collection} = require("discord.js");
const {token} = require("../config.json");



//creates client isntance of bot
const client = new Client(
    {intents: [GatewayIntentBits.Guilds]}
);

client.commands = new Collection();
client.cooldowns = new Collection();

const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath)

for(const folder of commandFolders){
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath)
        .filter(file => file.endsWith('.js'))
    for(const file of commandFiles){
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        if("data" in command && 'execute' in command){
            client.commands.set(command.data.name, command);
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute property`)
        }
    }
}

const eventPath = path.join(__dirname, "events");
const eventFolder = fs.readdirSync(eventPath).filter(file=>file.endsWith(".js"))
for(const file of eventFolder){
    const filePath = path.join(eventPath, file);

    const event = require(filePath);
    if(event.once){
        client.once(event.name, (...args) => event.execute(...args))
    } else {
        client.on(event.name, (...args) => event.execute(...args))
    }
}

//logs the client in as the bot
client.login(token)