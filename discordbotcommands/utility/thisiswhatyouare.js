const { SlashCommandBuilder, MessageFlags } = require("discord.js");
const wait = require("node:timers/promises").setTimeout;

module.exports = {
    // Define the data property as an instance of SlashCommandBuilder
    data: new SlashCommandBuilder()
        .setName("you") // Slash command name
        .setDescription("This will describe the type of person you are"), // Slash command description
    

    // Define the execute method separately
    async execute(interaction) {

        await interaction.reply("you a bitch");
        await wait(4_000);
        await interaction.editReply("You're still a bitch lmao");
        // await interaction.reply("you a bitch");
        // await interaction.followUp("You're still a bitch LMAO");
    },
};