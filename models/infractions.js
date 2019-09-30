module.exports = function(sequelize, DataTypes) {
  var Infractions = sequelize.define("Infractions", {
    userID: DataTypes.STRING,
    staffID: DataTypes.STRING,
    type: DataTypes.STRING,
    channelName: DataTypes.STRING,
    message: DataTypes.STRING
  });
  return Infractions;
};
