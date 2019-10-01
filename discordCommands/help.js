let Discord = require("discord.js");
let getUser = require("../discordFunctions/findUser");

module.exports = {
  help: {
    name: "help",
    description: "!help < @user || userID > message to be saved/logged here"
  },
  run: async function(bot, message, db, serverProfile, args) {
    const embed = new Discord.RichEmbed()
      .setAuthor("Help", bot.user.displayAvatarURL)
      .setColor("#0b6c29")
      .setDescription(
        "replace < @user || userID > with <@!158722762951753728> or 158722762951753728"
      )
      .addField(
        "warn",
        `${serverProfile.prefix}warn < @user || userID > message to be saved/logged here`
      )
      .addField(
        "ban",
        `${serverProfile.prefix}ban < @user || userID > message to be saved/logged here`
      )
      .addField(
        "mute",
        `${serverProfile.prefix}mute < @user || userID > message to be saved/logged here`
      )
      .addField(
        "kick",
        `${serverProfile.prefix}kick < @user || userID > message to be saved/logged here`
      );
    message.channel.send(embed);
  }
};
