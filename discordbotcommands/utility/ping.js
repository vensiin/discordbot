const {SlashCommandBuilder} = require("discord.js");

// Module exports is here so that this command can be read by other files
module.exports = {
    // Define the data property as an instance of SlashCommandBuilder
    data: new SlashCommandBuilder()
        .setName("lebron") // Slash command name
        .setDescription("Replies with you are my sunshine"), // Slash command description
    

    // Define the execute method separately
    async execute(interaction) {
        await interaction.reply("YOU ARE MY SUNSHINE!");
    },
};
