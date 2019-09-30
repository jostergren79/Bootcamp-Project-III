module.exports = function(sequelize, DataTypes) {
  var serverProfiles = sequelize.define("serverProfiles", {
    guildID: DataTypes.STRING,
    guildName: DataTypes.STRING,
    prefix: DataTypes.STRING,
    logsChannel: DataTypes.STRING,
    modLogs: DataTypes.STRING
  });
  return serverProfiles;
};
