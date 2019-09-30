const Discord = require("discord.js");
const db = require("../models");

exports.run = async (bot, oldVoiceChannel, newVoiceChannel) => {
  //get the server profile from the database
  let serverProfile = await db.serverProfiles.findOne({
    guildID: oldVoiceChannel.guild.id
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

  //set the description based on whats happening
  if (oldVoiceChannel.voiceChannelID === null) {
    //if the user was in no previous channel
    embed.setDescription(
      `:telephone: ${newVoiceChannel.user.username}#${newVoiceChannel.user.discriminator} (${newVoiceChannel.user.id})` +
        `joined **<#${newVoiceChannel.voiceChannelID}>**`
    );
  } else if (oldVoiceChannel.voiceChannelID === undefined) {
    //if the user was in no previous channel "sometimes the wrapper messes up ..."
    embed.setDescription(
      `:telephone: ${newVoiceChannel.user.username}#${newVoiceChannel.user.discriminator} (${newVoiceChannel.user.id})` +
        `joined **<#${newVoiceChannel.voiceChannelID}>**`
    );
  } else if (newVoiceChannel.voiceChannelID === null) {
    //if the user left the channel
    embed.setDescription(
      `:telephone: ${newVoiceChannel.user.username}#${newVoiceChannel.user.discriminator}(${newVoiceChannel.user.id})` +
        `left **<#${oldVoiceChannel.voiceChannelID}>**`
    );
  } else if (
    oldVoiceChannel.voiceChannelID !== newVoiceChannel.voiceChannelID
  ) {
    // if the user moved channels
    embed.setDescription(
      `:telephone: ${newVoiceChannel.user.username}#${newVoiceChannel.user.discriminator} (${newVoiceChannel.user.id})` +
        `moved from **<#${oldVoiceChannel.voiceChannelID}>** to **<#${newVoiceChannel.voiceChannelID}>**`
    );
  }
  //if the logs channel exists send the embed that we have created
  if (serverProfile.modLogs !== "") {
    bot.channels.get(serverProfile.logsChannel).send(embed);
  }
};
