require("dotenv").config();

//
const FormData = require("form-data");
const axios = require("axios");
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

    let User;
    let authorization;

    fetch("https://discordapp.com/api/oauth2/token", {
      method: "POST",
      body: data
    })
      .then(r => r.json())
      .then(response => {
        console.log(response);
        authorization = `${response.token_type} ${response.access_token}`;
        fetch("https://discordapp.com/api/users/@me", {
          method: "GET",
          headers: {
            authorization: `${response.token_type} ${response.access_token}`
          }
        })
          .then(r => r.json())
          .then(userResponse => {
            console.log(userResponse);
            console.log(authorization);
            User = userResponse;
            User.tag = `${userResponse.username}#${userResponse.discriminator}`;
            User.avatarURL = userResponse.avatar
              ? `https://cdn.discordapp.com/avatars/${userResponse.id}/${userResponse.avatar}.png?size=1024`
              : null;

            fetch("https://discordapp.com/api/users/@me/guilds", {
              method: "GET",
              headers: {
                authorization: authorization
              }
            })
              .then(r => r.json())
              .then(guildResponse => {
                console.log(guildResponse);
                User.guilds = [];
                User.guildsManage = [];
                for (let i = 0; i < guildResponse.length; i++) {
                  if (guildResponse[i].icon === null) {
                    guildResponse[
                      i
                    ].iconURL = `https://discordapp.com/assets/322c936a8c8be1b803cd94861bdfa868.png`;
                  } else {
                    guildResponse[
                      i
                    ].iconURL = `https://cdn.discordapp.com/icons/${guildResponse[i].id}/${guildResponse[i].icon}.jpg`;
                  }
                  let perm = (guildResponse[i].permissions & 0x8) !== 0;
                  let manage = (guildResponse[i].permissions & 0x20) !== 0; // 0x20 = MANAGGE_GUILD
                  if (perm === true) {
                    User.guilds.push(guildResponse[i]);
                  } else if (manage === true) {
                    User.guildsManage.push(guildResponse[i]);
                  }
                  if (i + 1 === guildResponse.length) {
                    req.session.user = userResponse;
                    res.redirect("/servers");
                  }
                }
                //User.guilds = guildResponse;
              });
          });
      });

    // axios.post("https://discordapp.com/api/oauth2/token", {
    //     headers: {
    //       'Content-Type': 'application/x-www-form-urlencoded'
    //     },
    //     body: data
    //   })
    //   .then(tokenResponse => {
    //     authorization = `${tokenResponse.token_type} ${tokenResponse.access_token}`;
    // axios
    //   .get("https://discordapp.com/api/users/@me", {
    //     headers: {
    //       authorization
    //     }
    //   })
    //   .then(userResponse => {
    //     User = userResponse;
    //     User.tag = `${userResponse.username}#${userResponse.discriminator}`;
    //     User.avatarURL = userResponse.avatar
    //       ? `https://cdn.discordapp.com/avatars/${userResponse.id}/${userResponse.avatar}.png?size=1024`
    //       : null;
    //     axios
    //       .get("https://discordapp.com/api/users/@me/guilds", {
    //         headers: {
    //           authorization
    //         }
    //       })
    //       .then(guildResponse => {
    //         User.guilds = [];
    //         User.guildsManage = [];
    //         let count = [];
    //         for (let i = 0; i < guildResponse.length; i++) {
    //           count.push(true);
    //           if (guildResponse[i].icon === null) {
    //             guildResponse[
    //               i
    //             ].iconURL = `https://discordapp.com/assets/322c936a8c8be1b803cd94861bdfa868.png`;
    //           } else {
    //             guildResponse[
    //               i
    //             ].iconURL = `https://cdn.discordapp.com/icons/${guildResponse[i].id}/${guildResponse[i].icon}.jpg`;
    //           }
    //           let perm = (guildResponse[i].permissions & 0x8) !== 0;
    //           let manage = (guildResponse[i].permissions & 0x20) !== 0; // 0x20 = MANAGE_GUILD
    //           if (perm === true) {
    //             User.guilds.push(guildResponse[i]);
    //           } else if (manage === true) {
    //             User.guildsManage.push(guildResponse[i]);
    //           }
    //           if (i + 1 === guildResponse.length) {
    //             req.session.user = userResponse;
    //             res.redirect("/servers");
    //           }
    //         }
    //       });
    //   });
  });
  // });

  app.get("/servers", (req, res) => {
    res.json(req.session.user);
  });
};
