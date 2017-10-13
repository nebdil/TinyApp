const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080;
const bodyParser = require("body-parser");
const cookieSession = require('cookie-session');
const bcrypt = require('bcrypt');
const urlDatabase = {
  "b2xVn2": {
    short: "b2xVn2",
    long: "http://www.lighthouselabs.ca",
    userID: "userRandomID",
  },
  "gsm5xK": {
      short: "gsm5xK",
      long: "http://www.google.com",
      userID: "user2RandomID",
  }
};
const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "$2a$10$hj6AjdzmiZUm.eB9ptFPkunVwnMwo4ZwEpvd6Q7AgOFxBiPdA9jKO"
    //bcrypt.hashSync("purple-monkey-dinosaur", 10)
  },
 "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "$2a$10$1tLuMRLTz40gug4jv90NEONB4EVIKClzfMpjSQDF.WW8w0Gz.G7Ie"
    //bcrypt.hashSync("dishwasher-funk", 10)
  }
};
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({
  name: 'session',
  keys: ['key1']
}))
app.set("view engine", "ejs");

function generateRandomString() {
    var str = "";
    //regex
    var char = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for(var i = 0; i < 6; i++) {
        str += char.charAt(Math.floor(Math.random() * char.length));
    }
    // console.log(str);
    return str;
};

function urlsForUser(id) {
  var filteredURL =  {};
  for (var key in urlDatabase) {
    if (urlDatabase[key].userID === id) {
      filteredURL[key] = {long: urlDatabase[key].long, short: urlDatabase[key], userID: urlDatabase[key].userID}
    }
  }
  return filteredURL;
};

app.get("/urls/register", (req, res) => {
  let templateVars = {
    urls: urlDatabase,
    user: users[req.session["user_id"]]
  };
  res.render("urls_registration", templateVars);
});

app.post("/urls/register", (req, res) => {
  let newId = generateRandomString();
  const password = req.body.password;
  const hashedPassword = bcrypt.hashSync(password, 10);
  for (let key in users) {
    if (users[key].email === req.body.email) {
      res.status(400).send("Sorry existing email");
      return false;
    }
  }
  if (!req.body.email || bcrypt.com) {
    res.status(404).send("Sorry, invalid email or password");
  }
  else if(true) {
      users[newId] = {
        id: newId,
        email: req.body.email,
        password: hashedPassword
      }
      req.session.user_id = newId;
      res.redirect("/urls");
    }
});

app.get("/", (req, res) => {
  if (req.session.user_id) {
    res.redirect("/urls");
  } else {
    res.redirect("/login");
  }
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.end("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/u/:id", (req, res) => {
  let shortURL = urlDatabase[req.params.id];
  let longURL = shortURL.long;
  res.redirect(longURL);
});

app.get("/urls", (req, res) => {
  let templateVars = {
    urls: urlsForUser(req.session["user_id"]),
    user: users[req.session["user_id"]]
  };
  if (!req.session["user_id"]) {
    templateVars.errorMessages = "You have to login or register to continue."
    res.render("urls_error", templateVars);
  }
  else {
    res.render("urls_index", templateVars);
  }
});

app.post("/urls", (req, res) => {
    let newShortURL = generateRandomString();
    urlDatabase[newShortURL] = {
      short: newShortURL,
      long: req.body.longURL,
      userID: req.session["user_id"]
    }
  res.redirect(`urls/${newShortURL}`);
});

app.get("/urls/new", (req, res) => {
  if (req.session["user_id"]) {
    let templateVars = {
      urls: urlDatabase,
      user: users[req.session["user_id"]]
    };
    res.render("urls_new", templateVars);
  }
  else {
    res.redirect("/login");
  }
});

app.get("/urls/:id", (req, res) => {
  let templateVars = {
    shortURL: req.params.id,
    longURL: urlDatabase[req.params.id],
    user: users[req.session["user_id"]]
  };
  if (urlDatabase[req.session["user_id"]]) {
    if (req.session["user_id"]) {
    if (req.session["user_id"] === urlDatabase[req.params.id].userID) {
      res.render("urls_show", templateVars);
    } else {
      templateVars.errorMessages = "Sorry, this shortened URL is not yours to access.";
      res.render("urls_error", templateVars);
    }
    } else {
      templateVars.errorMessages = "Sorry, you are not logged in. Log in or register to access."
      res.render("urls_error", templateVars);
    }
  } else {
    templateVars.errorMessages = "Sorry, this id does not exist."
    res.render("urls_error", templateVars);
  }
});

app.post("/urls/:id", (req, res) => {
  if (req.session["user_id"] === urlDatabase[req.params.id].userID) {
    urlDatabase[req.params.id].long = req.body.inputURL;
  }
  res.redirect("/urls");
});

app.post("/urls/:id/delete", (req, res) => {
  if (req.session["user_id"] === urlDatabase[req.params.id].userID) {
    delete urlDatabase[req.params.id];
  }
  res.redirect("/urls");
})

app.get("/login", (req, res) => {
  let templateVars = {
    urls: urlDatabase,
    user: users[req.session["user_id"]]
  };
  res.render("urls_login", templateVars);
});

app.post("/login", (req, res) => {
  let hasEmail = false;
  for (let key in users) {
    if (users[key].email === req.body.email) {
      if (bcrypt.compareSync(req.body.password, users[key].password)) {
        hasEmail = true;
        req.session.user_id = users[key].id;
        console.log("everything fine");
        console.log(req.body.password);
        console.log(users[key].password);
        res.redirect("/");
      }
      else {
        hasEmail = true;
        res.status(403).send("Sorry, password does not match");
        console.log("no pass");
      }
    }
  }
  if (!hasEmail) {
    console.log("no email");
    res.status(403).send("Sorry, email provided is invalid");
  }
});

app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/urls");
});



app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
