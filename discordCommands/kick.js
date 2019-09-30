let Discord = require("discord.js");
let getUser = require("../discordFunctions/findUser");

module.exports = {
  help: {
    name: "kick",
    description: "!kick < @user || userID > message to be saved/logged here"
  },
  run: async function(bot, message, db, serverProfile, args) {
    if (args[0] === undefined)
      return message.channel.send("ERROR: no user given");
    const actionUser = await getUser(bot, message, args[0]);
    args.splice(0, 1);
    db.Infractions.create({
      userID: actionUser.id,
      staffID: message.author.id,
      type: "kick",
      channelName: message.channel.name,
      message: args.join(" ") || ""
    });
    const embed = new Discord.RichEmbed()
      .addField("User", actionUser.user.username)
      .addField("Staff", message.author.username)
      .addField("type", "kick")
      .addField("message", args.join(" ") || " ");
    message.channel.send(embed);
    if (serverProfile.modLogs !== "")
      message.guild.channels
        .find(chan => chan.id === serverProfile.modLogs)
        .send(embed);
    message.guild.member(actionUser).kick(args.join(" ") || " ");
  }
};
