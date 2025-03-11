const { Events} = require("discord.js");

/*
-Receiving Command Interactions
You will receive an interaction for every slash command executed. 
To respond to a command, you need to create a listener for the Client#interactionCreate event that will execute code when your application receives an interaction.
*/

// When the client is ready, run this code (only once).
// The distinction between `client: Client<boolean>` and `readyClient: Client<true>` is important for TypeScript developers.
// It makes some properties non-nullable.

module.exports = {
        name: Events.ClientReady, // The name property states which event this file is for
        once: true, // Holds a boolean value that specifies if the event should only run once
        execute(client) {
            console.log(`I'm ready! Logged in as ${client.user.tag}`);
        },
};