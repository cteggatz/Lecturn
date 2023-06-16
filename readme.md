#Lecturn Bot
this is a guide to some of the functionality that comes with the Lecturn bot

----
##Config
Currently there are two config files inside of lecturn that need to be configured in order for the bot to work correctly
- Config.json : that contains the basic discordBot information. (this might not be included when pulling)
- serverStatusConfig : contains the information needed for pinging and starting the routed server




----

##Commands
as of right now Lecturn is equipt with two commands.
- **server status** : a command that pings the server and sees if it is online and who is currently playing
- **start server** : a command that will attempt to start the run.bat file as seen inside of the serverStatusConfig.json file.

----

##Database
Lecturn is equipt with a database for the server's Minecraft Museum storing who has commitied what to the database. Currenty the database is equipt with: 
- a clean database containing every single block in minecraft and the most recent donations to the museum
- backups : both daily backups and most recent action.