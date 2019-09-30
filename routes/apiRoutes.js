var db = require("../models");

module.exports = function(app) {
  // app.delete("/api/examples/:id", function(req, res) {
  //   db.Example.destroy({ where: { id: req.params.id } }).then(function(
  //     dbExample
  //   ) {
  //     res.json(dbExample);
  //   });
  // });

  app.get("/api/infractions", function(req, res) {
    if (!req.session.user) {
      return res.status(401).send({
        status: "ERROR",
        error: "Unauthorized"
      });
    }
    db.Infractions.findAll({
      where: {
        authorId: req.body.id
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
