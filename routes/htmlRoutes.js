var db = require("../models");
const fetch = require("node-fetch");

module.exports = function(app) {
  // Load index page
  app.get("/settings", function(req, res) {
    if (!req.session.user) {
      return res.status(401).redirect("/");
    }
    db.serverProfiles
      .findOne({
        where: {
          guildID: "627156913028857866"
        }
      })
      .then(function(settings) {
        if (settings === null) {
          settings = {
            guildID: "627156913028857866",
            guildName: "Green Lantern",
            prefix: "!",
            logsChannel: "",
            modLogs: ""
          };
          db.serverProfiles.create(settings);
        }
        res.render("settings", {
          title: "guild settings",
          prefix: settings.prefix,
          logsChannel: settings.logsChannel,
          modLogs: settings.modLogs
        });
      });
  });

  // Load infractions page
  app.get("/infractions", function(req, res) {
    if (!req.session.user) {
      return res.status(401).redirect("/");
    }
    res.render("infractions", {
      title: "infractions"
    });
  });

  // Load index page
  app.get("/logs", function(req, res) {
    if (!req.session.user) {
      return res.status(401).redirect("/");
    }
    db.serverLogs
      .findAll({
        where: {
          guildID: "627156913028857866"
        }
      })
      .then(function(logs) {
        logs.sort((a, b) => b.id - a.id);
        res.render("logs", {
          title: "logs",
          logs
        });
      });
  });

  // Render 404 page for any unmatched routes
  app.get("*", function(req, res) {
    fetch(
      "https://api.giphy.com/v1/gifs/search?api_key=G4QzXGn24vfsHW4XQfzt2aNZdHBRRhRK&q=404&limit=1&offset=0&rating=G&lang=en"
    )
      .then(response => {
        return response.json();
      })
      .then(data => {
        const results = data.data[0].embed_url;

        res.render("404", {
          gif: results
        });
      })
      .catch(err => {
        // Do something for an error here
      });
  });
};
