const {SlashCommandBuilder} = require("discord.js");
const { cooldown } = require("./user");


module.exports = {
    cooldown: 5,
    data: new SlashCommandBuilder()
          .setName("server")
          .setDescription("Provides information about the server"),
    async execute (interaction){
        await interaction.reply(`This is the ${interaction.guild.name} and has ${interaction.guild.memberCount} members`);
    },
};