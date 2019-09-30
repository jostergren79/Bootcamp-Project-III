module.exports.getMuteRole = async (bot, message) => {
  return new Promise(async (resolve, reject) => {
    //get the guild
    let guild = await bot.guilds.find(guild => guild.id === message.guild.id);
    //check if the mute role exists
    let muteRole = await guild.roles.find(role => role.name === "Muted");
    //if not then make one
    if (!muteRole) {
      try {
        muteRole = await guild.createRole({
          name: "Muted",
          color: "#000000",
          permissions: []
        });
        //add the role to each channel in the discord
        guild.channels.forEach(async (channel, id) => {
          await channel.overwritePermissions(muteRole, {
            SEND_MESSAGES: false,
            ADD_REACTIONS: false
          });
        });
      } catch (e) {
        console.log(e.stack);
      }
    }
    //resolve the promise with the mute role either the new one or the one that exists
    resolve(muteRole);
  });
};
