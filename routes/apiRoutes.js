var db = require("../models");

module.exports = function(app) {
  // Get all examples
  app.get("/api/examples", function(req, res) {
    db.Example.findAll({}).then(function(dbExamples) {
      res.json(dbExamples);
    });
  });

  // Create a new example
  app.post("/api/examples", function(req, res) {
    db.Example.create(req.body).then(function(dbExample) {
      res.json(dbExample);
    });
  });

  // Delete an example by id
  app.delete("/api/examples/:id", function(req, res) {
    db.Example.destroy({ where: { id: req.params.id } }).then(function(
      dbExample
    ) {
      res.json(dbExample);
    });
  });

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
};
