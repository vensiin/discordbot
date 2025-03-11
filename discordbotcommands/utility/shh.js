const { SlashCommandBuilder, MessageFlags } = require("discord.js")

module.exports = {
    // Define the data property as an instance of SlashCommandBuilder
    data: new SlashCommandBuilder()
        .setName("shh") // Slash command name
        .setDescription("A message only you can see :)"), // Slash command description
    

    // Define the execute method separately
    async execute(interaction) {
        await interaction.reply({content: "you a bitch", flags:MessageFlags.Ephemeral});
    },
};