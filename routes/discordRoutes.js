require("dotenv").config();

//
const FormData = require("form-data");
const axios = require("axios");

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const redirectURL =
  process.env.REDIRECT_URL || "http://localhost:3000/callback";
const scopes = ["identify", "guilds", "guilds.join"];

module.exports = function(app) {
  // login to discord and send the user back to us with valid data
  app.get("/login", function(req, res) {
    res.redirect(
      `https://discordapp.com/api/oauth2/authorize?client_id=${CLIENT_ID}&scope=identify&response_type=code&redirect_uri=${encodeURIComponent(
        redirectURL
      )}`
    );
  });

  app.get("/callback", (req, res) => {
    if (!req.query.code) {
      return res.status(400).send({
        status: "ERROR",
        error: "NoCodeProvided"
      });
    }
    const accessCode = req.query.code;
    const data = new FormData();
    data.append("client_id", CLIENT_ID);
    data.append("client_secret", CLIENT_SECRET);
    data.append("grant_type", "authorization_code");
    data.append("redirect_uri", redirectURL);
    data.append("scope", scopes.join(" "));
    data.append("code", accessCode);
    axios
      .post("https://discordapp.com/api/oauth2/token", {
        body: data
      })
      .then(tokenResponse => {
        axios
          .get("https://discordapp.com/api/users/@me", {
            headers: {
              authorization: `${tokenResponse.token_type} ${tokenResponse.access_token}`
            }
          })
          .then(userResopnse => {});
      });
  });
};
