require("dotenv").config();

//
const FormData = require("form-data");
const fetch = require("node-fetch");

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const redirectURL =
  process.env.REDIRECT_URL || "http://localhost:3000/callback";
const scopes = ["identify", "guilds", "guilds.join"];

module.exports = function(app) {
  // login to discord and send the user back to us with valid data
  app.get("/login", function(req, res) {
    res.redirect(
      `https://discordapp.com/api/oauth2/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(
        redirectURL
      )}&scope=${scopes.join("%20")}`
    );
  });

  app.get("/callback", (req, res) => {
    // if we get no code back from discord through an error
    if (!req.query.code) {
      return res.status(400).send({
        status: "ERROR",
        error: "NoCodeProvided"
      });
    }
    const accessCode = req.query.code;

    // set the data to form data as that is what discords Oath2 docs say that are required to use this endpoint
    const data = new FormData();
    data.append("client_id", CLIENT_ID);
    data.append("client_secret", CLIENT_SECRET);
    data.append("grant_type", "authorization_code");
    data.append("redirect_uri", redirectURL);
    data.append("scope", scopes.join(" "));
    data.append("code", accessCode);

    let User;
    let authorization;

    // do a post to get the token
    fetch("https://discordapp.com/api/oauth2/token", {
      method: "POST",
      body: data
    })
      .then(r => r.json()) // magic
      .then(response => {
        // create the authorization header
        authorization = `${response.token_type} ${response.access_token}`;
        fetch("https://discordapp.com/api/users/@me", {
          method: "GET",
          headers: {
            authorization
          }
        })
          .then(r => r.json()) // magic
          .then(userResponse => {
            //start building the user object to store in this session
            User = userResponse;
            User.tokenRes = response;
            User.authorization = `${response.token_type} ${response.access_token}`;
            User.tag = `${userResponse.username}#${userResponse.discriminator}`;
            User.avatarURL = userResponse.avatar
              ? `https://cdn.discordapp.com/avatars/${userResponse.id}/${userResponse.avatar}.png?size=1024`
              : null;

            fetch("https://discordapp.com/api/users/@me/guilds", {
              method: "GET",
              headers: {
                authorization
              }
            })
              .then(r => r.json())
              .then(guildResponse => {
                // initalize empty arrays to store the guilds in
                User.guilds = [];
                User.guildsManage = [];

                // loop through the guilds to get permission levels and iconURL's
                for (let i = 0; i < guildResponse.length; i++) {
                  //get iconURL weather it be custom or default
                  if (guildResponse[i].icon === null) {
                    guildResponse[
                      i
                    ].iconURL = `https://discordapp.com/assets/322c936a8c8be1b803cd94861bdfa868.png`;
                  } else {
                    guildResponse[
                      i
                    ].iconURL = `https://cdn.discordapp.com/icons/${guildResponse[i].id}/${guildResponse[i].icon}.jpg`;
                  }
                  //check the user permission level for the server to check if they have MANAGE_GUILD or ADMINISTRATOR
                  let perm = (guildResponse[i].permissions & 0x8) !== 0; // 0x8 = ADMINISTRATOR
                  let manage = (guildResponse[i].permissions & 0x20) !== 0; // 0x20 = MANAGE_GUILD

                  //if the user has either permission put the guild data in the given array other wise dont save it because the user cant do anything with it anyway
                  if (perm === true) {
                    User.guilds.push(guildResponse[i]);
                  } else if (manage === true) {
                    User.guildsManage.push(guildResponse[i]);
                  }

                  //if the loop is complete bind the session and redirect them to the appropriate endpoint to use the dashboard for temp "/servers"
                  if (i + 1 === guildResponse.length) {
                    req.session.user = User;
                    res.redirect("/dashboard");
                  }
                }
              });
          });
      });
  });

  // app.get("/servers", (req, res) => {
  //   //if we dont have a session for the user then give Unauthorized
  //   if (!req.session.user) {
  //     return res.status(401).send({
  //       status: "ERROR",
  //       error: "Unauthorized"
  //     });
  //   }
  //   res.json(req.session);
  // });
};
