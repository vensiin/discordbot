const { SlashCommandBuilder, ChannelType } = require("discord.js");
const { joinVoiceChannel, VoiceConnectionStatus, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require("@discordjs/voice");

module.exports = {

  data: new SlashCommandBuilder()
    .setName("joinvoice")
    .setDescription("Joins a voice channel")
    .addChannelOption((option) => option.setName("channel").setDescription("The Channel to join").setRequired(true).addChannelTypes(ChannelType.GuildVoice)),
  async execute(interaction) {
    await interaction.reply("Joining the voice channel");
    const voiceChannel = interaction.options.getChannel("channel"); // Gets the channel of who called the command
    console.log(voiceChannel); // Outputs voice channel details

    // Creating voiceConnection
    console.log("create connection");
    const connection = joinVoiceChannel({
      channelId: voiceChannel.id, 
      guildId: voiceChannel.guild.id,
      adapterCreator: voiceChannel.guild.voiceAdapterCreator,
      selfDeaf: false,
      selfMute: false,
    });
    console.log(connection); // Logs the connection details

    // create audio player
    const audioPlayer = createAudioPlayer(); // How the audio will play
    console.log("create file reference");

    const resource = createAudioResource("C://discordbot//my_sound.mp3"); // Audio resource to what/where the audio is

    try {
      connection.on(VoiceConnectionStatus.Ready, () => {
        console.log("The connection has entered the ready state - ready to play audio!");
        console.log("subscribe to connection");
        connection.subscribe(audioPlayer);
        console.log("play audio");
        audioPlayer.play(resource);
      });

      // Everything is successful and the audio is playing
      audioPlayer.on(AudioPlayerStatus.Playing, () => {
        console.log("The audio player has started playing!");
      });

      

      audioPlayer.on("error", (error) => {
        console.error(`Error: ${error.message} with resource ${error.resource.metadata.title}`);
        connection.destroy();
      });

    } catch (error) {
      connection.destroy();
      throw error;
    }
  },
};