var db = require("../models");

module.exports = function(app) {
  app.post("/api/settings", function(req, res) {
    console.log(JSON.stringify(req.body, null, 4));
    db.serverProfiles
      .update(
        {
          prefix: req.body.prefix,
          logsChannel: req.body.serverLogs,
          modLogs: req.body.modLogs
        },
        {
          where: {
            guildID: "627156913028857866"
          }
        }
      )
      .then(() => {
        res.json({ message: "success" });
      });
  });

  app.post("/api/infractions", function(req, res) {
    // if (!req.session.user) {
    //   return res.status(401).send({
    //     status: "ERROR",
    //     error: "Unauthorized"
    //   });
    // }
    console.log(req.body);
    db.Infractions.findAll({
      where: {
        userID: req.body.userID
      }
    }).then(function(results) {
      res.json(results);
    });
  });

  app.get("/api/logs", function(req, res) {
    if (!req.session.user) {
      return res.status(401).send({
        status: "ERROR",
        error: "Unauthorized"
      });
    }
    db.serverLogs
      .findAll({
        where: {
          authorLogs: req.body.id
        }
      })
      .then(function(results) {
        res.json(results);
      });
  });

  app.get("/api/logs", function(req, res) {
    if (!req.session.user) {
      return res.status(401).send({
        status: "ERROR",
        error: "Unauthorized"
      });
    }
    db.serverLogs
      .findAll({
        where: {
          authorLogs: req.body.id
        }
      })
      .then(function(results) {
        res.json(results.data);
      });
  });
};
