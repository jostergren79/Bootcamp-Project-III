module.exports = function(sequelize, DataTypes) {
  var serverLogs = sequelize.define("serverLogs", {
    guildID: DataTypes.STRING,
    message: DataTypes.STRING
  });
  return serverLogs;
};
