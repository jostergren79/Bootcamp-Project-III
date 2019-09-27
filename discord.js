const Discord = require("discord.js");
const bot = new Discord.Client();
require("dotenv").config();

bot.on("ready", () => {
  console.log(`${bot.user.username} is online`);
});

bot.login(process.env.DISCORD_API);

module.exports = bot;
