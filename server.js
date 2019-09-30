require("dotenv").config();
let express = require("express");
let exphbs = require("express-handlebars");
const session = require("express-session");

let db = require("./models");

let app = express();
let PORT = process.env.PORT || 3000;
let SECRET = process.env.SESSION_SECRET;

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));

// store the session data
app.use(
  session({
    secret: SECRET,
    resave: false,
    saveUninitialized: false,
    expires: 604800000
  })
);

// Handlebars
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Routes
require("./routes/apiRoutes")(app);
require("./routes/discordRoutes")(app);
require("./routes/htmlRoutes")(app);

var syncOptions = { force: false };

// If running a test, set syncOptions.force to true
// clearing the `testdb`
if (process.env.NODE_ENV === "test") {
  syncOptions.force = true;
}

// Starting the server, syncing our models ------------------------------------/
db.sequelize.sync(syncOptions).then(function() {
  app.listen(PORT, function() {
    console.log(
      "==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.",
      PORT,
      PORT
    );
  });
});
require("./discord.js");

module.exports = app;
