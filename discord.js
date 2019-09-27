const Discord = require("discord.js");
const bot = new Discord.Client();

bot.on("ready", () => {
  console.log(`${bot.user.username} is online`);
});

bot.login("");

module.exports = bot;
