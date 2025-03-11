const {SlashCommandBuilder } = require("discord.js");



module.exports = {
    cooldown: 5,
    data: new SlashCommandBuilder()
        .setName("user")
        .setDescription("Provides some information about the user"),

    async execute(interaction){
        await interaction.reply(`This command was ran by ${interaction.user.username}, who joined on ${interaction.member.JoinedAt}, they currently have these permissons ${interaction.member.permissions}`);
        console.log(`Executing command: ${interaction.commandName}`);
    },
    
};

