const Discord = require("discord.js");

exports.run = async (bot, db, oldVoiceChannel, newVoiceChannel) => {
  //get the server profile from the database
  let serverProfile = await db.serverProfiles.findOne({
    where: {
      guildID: oldVoiceChannel.guild.id
    }
  });
  //if the profile does not exist then make it and set a dummy one for now
  if (serverProfile === null) {
    await db.serverProfiles.create({
      guildID: oldVoiceChannel.guild.id,
      guildName: oldVoiceChannel.guild.name,
      prefix: "!",
      logsChannel: "",
      modLogs: ""
    });
    serverProfile = {
      guildID: oldVoiceChannel.guild.id,
      guildName: oldVoiceChannel.guild.name,
      prefix: "!",
      logsChannel: "",
      modLogs: ""
    };
  }
  //create a new discord embed and set the timestamp to right now
  let embed = new Discord.RichEmbed().setTimestamp(new Date());
  let voiceChanNew;
  let voiceChanOld;
  try {
    voiceChanOld = await bot.channels.get(oldVoiceChannel.voiceChannelID);
  } catch {}
  try {
    voiceChanNew = await bot.channels.get(newVoiceChannel.voiceChannelID);
  } catch {}

  let logging = ``;
  //set the description based on whats happening
  if (oldVoiceChannel.voiceChannelID === null) {
    //if the user was in no previous channel set the embed's description
    embed.setDescription(
      `:telephone: ${newVoiceChannel.user.username}#${newVoiceChannel.user.discriminator} (${newVoiceChannel.user.id}) joined **<#${newVoiceChannel.voiceChannelID}>**`
    );
    //set the log message
    logging = `${newVoiceChannel.user.username}#${newVoiceChannel.user.discriminator} (${newVoiceChannel.user.id}) joined ${voiceChanNew.name} (${newVoiceChannel.voiceChannelID})`;
  } else if (oldVoiceChannel.voiceChannelID === undefined) {
    //if the user was in no previous channel "sometimes the wrapper messes up ..."
    embed.setDescription(
      `:telephone: ${newVoiceChannel.user.username}#${newVoiceChannel.user.discriminator} (${newVoiceChannel.user.id}) joined **<#${newVoiceChannel.voiceChannelID}>**`
    );
    logging = `${newVoiceChannel.user.username}#${newVoiceChannel.user.discriminator} (${newVoiceChannel.user.id}) joined ${voiceChanNew.name} (${newVoiceChannel.voiceChannelID})`;
  } else if (newVoiceChannel.voiceChannelID === null) {
    //if the user left the channel
    embed.setDescription(
      `:telephone: ${newVoiceChannel.user.username}#${newVoiceChannel.user.discriminator}(${newVoiceChannel.user.id}) left **<#${oldVoiceChannel.voiceChannelID}>**`
    );
    logging = `${newVoiceChannel.user.username}#${newVoiceChannel.user.discriminator}(${newVoiceChannel.user.id}) left ${voiceChanOld.name} (${oldVoiceChannel.voiceChannelID})`;
  } else if (
    oldVoiceChannel.voiceChannelID !== newVoiceChannel.voiceChannelID
  ) {
    // if the user moved channels
    embed.setDescription(
      `:telephone: ${newVoiceChannel.user.username}#${newVoiceChannel.user.discriminator} (${newVoiceChannel.user.id})` +
        `moved from **<#${oldVoiceChannel.voiceChannelID}>** to **<#${newVoiceChannel.voiceChannelID}>**`
    );
    logging = `${newVoiceChannel.user.username}#${newVoiceChannel.user.discriminator} (${newVoiceChannel.user.id}) moved from ${voiceChanOld.name} (${oldVoiceChannel.voiceChannelID}) to ${voiceChanNew.name} (${newVoiceChannel.voiceChannelID})`;
  }
  //if the logs channel exists send the embed that we have created
  if (serverProfile.logsChannel !== "") {
    //because i dont care if it errors as anyone can put anything in the box for settings
    try {
      bot.channels.get(serverProfile.logsChannel).send(embed);
    } catch (err) {}
  }
  db.serverLogs.create({
    guildID: oldVoiceChannel.guild.id,
    message: logging
  });
};
