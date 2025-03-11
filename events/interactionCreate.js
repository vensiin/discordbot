const { Events, MessageFlags, Collection } = require("discord.js");

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    // This checks if it is not a slash input command (a slash command is an example of a ChatInputCommand)
    if (!interaction.isChatInputCommand()) return; // If it is not it just exits the command

    const command = interaction.client.commands.get(interaction.commandName); // Retrieves the command

    // Edge case for if command is not yet there
    if (!command) {
      console.error("We don't have that command yet, please ask the developer.");
      return;
    }

    // Cooldowns section: What it does?

    const { cooldowns } = interaction.client;

    // Checks if the cooldowns collection in the main file has an entry for the command being used.
    // If it doesn't have an entry it then adds a new entry where the value is initialized as an empty collection
    // It creates a “spreadsheet” (collection) for the whole command. 
    // Inside that command’s collection, you then add individual user entries (user IDs → timestamps) as they use the command inside the new mini collection made inside the main collection.
    if (!cooldowns.has(command.data.name)) {
      cooldowns.set(command.data.name, new Collection());
    }

    const now = Date.now(); // Current Timestamp
    const timestamps = cooldowns.get(command.data.name); // A reference to the collection of user ids and timestamp key/value pairs for the triggered command
    const defaultCooldownDuration = 3;
    const cooldownAmount = (command.cooldown ?? defaultCooldownDuration) * 1_000; // The specified cooldown for the command. If there is none then it defaults to the cooldown above (3sec). This is converted to milliseconds btw

    /*
    If the user has already used this command in this session, 
    get the timestamp,
    calculate the expiration time, 
    and inform the user of the amount of time they need to wait before using this command again.
    */

    // Conditional that checks if the user is in the timestamps collection. If the user does exists their usage time is being tracked.
    if (timestamps.has(interaction.user.id)) {
      // Uses get method to get the value(timestamp) associated to the userID of the command they used(key)
      const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount; // Sum up with the coolDownAmount variable to get the correct expiration timestamp. 
                                                                                   // Ex: If the user used the cmd at 8:55, expirationTime would be 8:55:03

      // Compares the current time with the expirationTime. If Now is less than current time, that means it they still have more time to wait
      if (now < expirationTime) {
        const expiredTimeStamp = Math.round(expirationTime / 1_000); // Converts the time into seconds
        // Informs the user how much time they have left
        return interaction.reply({ content: `You can't use ${command.data.name} yet. Please wait <t:${expiredTimeStamp}:R>.`, flags: MessageFlags.Ephemeral });
      }
    }

    // If the user is not on cooldown, record the current time as the last usage
    timestamps.set(interaction.user.id, now);
    setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount); // Removes the user's ID from the timestamp collection

    // Try and catch method
    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ content: "There was an error while executing this command", flags: MessageFlags.Ephemeral });
      } else {
        await interaction.reply({ content: "There was an error while executing this command!", flags: MessageFlags.Ephemeral });
      }
    }
  },
};