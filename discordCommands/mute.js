let Discord = require("discord.js");
let getUser = require("../discordFunctions/findUser");
let getMuteRole = require("../discordFunctions/makeMuteRole").getMuteRole;

module.exports = {
  help: {
    name: "mute",
    description: "!mute < @user || userID > message to be saved/logged here"
  },
  run: async function(bot, message, db, serverProfile, args) {
    if (args[0] === undefined)
      return message.channel.send("ERROR: no user given");
    const actionUser = await getUser(bot, message, args[0]);
    let muteRole = await getMuteRole(bot, message);
    let muted = false;
    await actionUser.roles.forEach(role => {
      if (role.id === muteRole.id) muted = true;
    });
    let action = "mute";
    if (muted) action = "unmute";
    args.splice(0, 1);
    db.Infractions.create({
      userID: actionUser.id,
      staffID: message.author.id,
      type: action,
      channelName: message.channel.name,
      message: args.join(" ") || ""
    });
    const embed = new Discord.RichEmbed()
      .addField("User", actionUser.user.username)
      .addField("Staff", message.author.username)
      .addField("type", action)
      .addField("message", args.join(" ") || "No Reason Given");
    message.channel.send(embed);
    if (serverProfile.modLogs !== "")
      message.guild.channels
        .find(chan => chan.id === serverProfile.modLogs)
        .send(embed);
    if (!muted) return await actionUser.addRole(muteRole.id);
    await actionUser.removeRole(muteRole.id);
  }
};
