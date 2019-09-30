module.exports = async (bot, message, userID) => {
  return new Promise(async (resolve, reject) => {
    let oof = await message.mentions.users.first();
    let user = [];
    let errors = [];
    if (oof) {
      try {
        let use = await bot.fetchUser(oof.id);
        user.push(use);
      } catch (err) {
        errors.push(err);
      }
    } else {
      try {
        let use = await bot.fetchUser(userID);
        user.push(use);
      } catch (err) {
        errors.push(err);
      }
    }
    if (errors.length !== 0) {
      resolve("NOT_USER");
    } else {
      let member = await bot.guilds
        .find(guild => guild.id === message.guild.id)
        .fetchMember(user[0], true);
      resolve(member);
    }
  });
};
