var db = require("../models");
const fetch = require("node-fetch");

module.exports = function(app) {
  // Load index page
  app.get("/", function(req, res) {
    res.sendfile();
    // db.Example.findAll({}).then(function(dbExamples) {
    //   res.render("index", {
    //     msg: "Welcome!",
    //     examples: dbExamples
    //   });
    // });
  });

  // Load example page and pass in an example by id
  app.get("/example/:id", function(req, res) {
    // db.Example.findOne({ where: { id: req.params.id } }).then(function(
    //   dbExample
    // ) {
    //   res.render("example", {
    //     example: dbExample
    //   });
    // });
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

        res.render("404", { gif: results });
      })
      .catch(err => {
        // Do something for an error here
      });
  });
};
