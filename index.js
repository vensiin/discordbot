// The fs module is Node's native file system module. fs is used to read the commands directory and identify our command files.
const fs = require("node:fs");

// Path helps construct paths to access files and directories.
//  One of the advantages of the path module is that it automatically detects the operating system and uses the appropriate joiners.
const path = require("node:path");

// Require the necessary discord.js classes
const { Client, Events, GatewayIntentBits, Collection, MessageFlags, ChannelType } = require('discord.js');
const { "bot token" : token } = require('./config.json'); // Put your config.json with your id's and token
const { log } = require("node:console");

// Create a new client instance 
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates] }); // Added GuildVoiceStates so bot could use voicechat

// When the client is ready, run this code (only once).
// The distinction between `client: Client<boolean>` and `readyClient: Client<true>` is important for TypeScript developers.
// It makes some properties non-nullable.
// client.once(Events.ClientReady, readyClient => {
// 	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
// });



// The Collection class extends JavaScript's native Map class, and includes more extensive, useful functionality.
//  Collection is used to store and efficiently retrieve commands for execution.
// A collection is like a 2D array in c++ or a python dictionary. It has a key and a value associated to that key. It does not have the squiggly brackets though.
client.commands = new Collection();

// Dynamically retrieve command files section

const foldersPath = path.join(__dirname, "discordbotCommands"); // Constructs a path to the commands directory
// This first readdirSync reads the path to the directory and returns an array of all the folder names in it (utility)
const commandFolders = fs.readdirSync(foldersPath);
console.log(commandFolders)

// Iterates through all the folder names in the directory
for (const folder of commandFolders){
	const commandsPath = path.join(foldersPath, folder); // Helps construct a path to the discordbotCommands/utility directory
	// This 2nd readdirSync reads the path to this directory(utility) and returns an array of all the files it contains (ping, server, and user)
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js")); // To ensure only the command files get processed we filtered it out with .js
	for (const file of commandFiles){
		const filePath = path.join(commandsPath,file);
		const command = require(filePath);

		// Dynamically set each command into client.commands
		// Checks if it has the "data" and "execute" properties 
		if ("data" in command && "execute" in command){
			client.commands.set(command.data.name, command);
		}
		else{
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

/*
-Receiving Command Interactions
You will receive an interaction for every slash command executed. 
To respond to a command, you need to create a listener for the Client#interactionCreate event that will execute code when your application receives an interaction.
*/

// client.on(Events.InteractionCreate, async interaction => {
// 	// This checks if it is not a slash input command (a slash command is an example of a ChatInputCommand)
// 	if (!interaction.isChatInputCommand()) return; // If it is not it just exits the command
	
// 	// Slash command that the user wanted initialized in this variable
// 	const command = interaction.client.commands.get(interaction.commandName);

// 	// Edge case for if command is not yet there
// 	if(!command){
// 		console.error("We don't have that command yet, please ask jvenson or davian");
// 		return;
// 	}
// 	// Try and catch method
// 	try{
// 		await command.execute(interaction);
// 	}
// 	 catch(error) {
// 		console.error(error);
// 		if (interaction.replied || interaction.deferred) {
// 			await interaction.followUp({content: "There was an error while executing this command", flags: MessageFlags.Ephemeral});
// 		}
// 		else{
// 			await interaction.reply({content:"There was an error while executing this command!", flags: MessageFlags.Ephemeral});
// 		}
// 	}
// });

// Dynamically retrieving our events 
// This is the same process as before where we read the path to the events folder and then read the array of files in said folder
const eventsPath = path.join(__dirname, "events");
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith(".js"));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
/*
The Client class in discord.js extends the EventEmitter class.
 Therefore, the client object exposes the .on() and .once() methods that you can use to register event listeners.
 These methods take two arguments: the event name and a callback function.
 These are defined in your separate event files as name and execute.
*/
	if(event.once) {
		client.once(event.name,(...args) => event.execute(...args));
	}
	else{
		client.on(event.name, (...args) => event.execute(...args));
	}
}

// Map associating the user's ID (key) with the last time they used the command. 
client.cooldowns = new Collection;


// Log in to Discord with your client's token
client.login(token);