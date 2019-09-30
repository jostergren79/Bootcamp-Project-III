const Discord = require("discord.js");
const fs = require("fs");
const bot = new Discord.Client();
require("dotenv").config();

bot.commands = new Set();

//read the discord commands directory
fs.readdir("./discordCommands/", (err, files) => {
  if (err) console.error(err);
  console.log(`Loading a total of ${files.length} discord bot Commands.`);
  //for each file import it and save it to the bot.commands obj
  files.forEach(f => {
    let props = require(`./discordCommands/${f}`);
    console.log(`Loading Command: ${props.help.name}. 👌`);
    bot.commands[props.help.name] = props;
  });
});

// read the discord events dir
fs.readdir("./discordEvents", (err, files) => {
  if (err) return console.error(err);
  //for each file import it and set a event listener based on the file name
  files.forEach(file => {
    let eventFunction = require(`./discordEvents/${file}`);
    let eventName = file.split(".")[0];
    console.log(`Loading Event: ${eventName}. 👌`);
    bot.on(eventName, (...args) => eventFunction.run(bot, ...args));
  });
});

bot.on("ready", () => {
  console.log(`${bot.user.username} is online`);
});

bot.login(process.env.DISCORD_API);

let db = require("./models");

bot.on("message", async message => {
  if (message.channel.type === "dm") return; //checks if the message received is in DM's or not
  if (message.author.bot) return;
  if (!message.member)
    message.member = await message.guild.fetchMember(message.author);
  let serverProfile = await db.serverProfiles.findOne({
    guildID: message.guild.id
  });
  if (serverProfile === null) {
    await db.serverProfiles.create({
      guildID: message.guild.id,
      guildName: message.guild.name,
      prefix: "!",
      logsChannel: "",
      modLogs: ""
    });
    serverProfile = {
      guildID: message.guild.id,
      guildName: message.guild.name,
      prefix: "!",
      logsChannel: "",
      modLogs: ""
    };
  }
  if (!message.content.startsWith(serverProfile.prefix)) return; //stops the script if the message does not start with the servers prefix
  let messageArray = message.content.split(" ");
  let cmd = messageArray[0].replace(serverProfile.prefix, "");
  let args = messageArray.slice(1); // slicing the message into individual words
  if (bot.commands[cmd.toLocaleLowerCase()])
    bot.commands[cmd.toLocaleLowerCase()].run(
      bot,
      message,
      db,
      serverProfile,
      args
    );
});

module.exports = bot;
