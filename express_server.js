const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080;
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const password = req.body.password;
const hashedPassword = bcrypt.hashSync(password, 10);
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
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
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
    user: users[req.cookies["user_id"]]
  };
  res.render("urls_registration", templateVars);
});

app.post("/urls/register", (req, res) => {
  let newId = generateRandomString();
  for (let key in users) {
    if (users[key].email === req.body.email) {
      res.status(400).send("Sorry existing email");
      return false;
    }
  }
  if (!req.body.email || !req.body.password) {
    res.status(404).send("Sorry, invalid email or password");
  }
  else if(true) {
      users[newId] = {
        id: newId,
        email: req.body.email,
        password: req.body.password
      }
      res.cookie("user_id", newId);
      res.redirect("/urls");
    }
});

app.get("/", (req, res) => {
  res.end("Hello!");
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
  if (!req.cookies["user_id"]) {
    res.send("Please login/register first");
  }
  else {
    let templateVars = {
      urls: urlsForUser(req.cookies["user_id"]),
      user: users[req.cookies["user_id"]]
    };
    res.render("urls_index", templateVars);
  }
});

app.post("/urls", (req, res) => {
    let newShortURL = generateRandomString();
    urlDatabase[newShortURL] = {
      short: newShortURL,
      long: req.body.longURL,
      userID: req.cookies["user_id"]
    }
  res.redirect(`urls/${newShortURL}`);
});

app.get("/urls/new", (req, res) => {
  if (req.cookies["user_id"]) {
    let templateVars = {
      urls: urlDatabase,
      user: users[req.cookies["user_id"]]
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
    user: users[req.cookies["user_id"]]
  };
  if (req.cookies["user_id"] === urlDatabase[req.params.id].userID) {
    res.render("urls_show", templateVars);
  }
  else {
    res.status(403).send("Restricted site");
  }
});

app.post("/urls/:id", (req, res) => {
  if (req.cookies["user_id"] === urlDatabase[req.params.id].userID) {
    urlDatabase[req.params.id].long = req.body.inputURL;
  }
  res.redirect("/urls");
});

app.post("/urls/:id/delete", (req, res) => {
  if (req.cookies["user_id"] === urlDatabase[req.params.id].userID) {
    delete urlDatabase[req.params.id];
  }
  res.redirect("/urls");
})

app.get("/login", (req, res) => {
  let templateVars = {
    urls: urlDatabase,
    user: users[req.cookies["user_id"]]
  };
  res.render("urls_login", templateVars);
});

app.post("/login", (req, res) => {
  let hasEmail = false;
  for (let key in users) {
    if (users[key].email === req.body.email) {
      if (users[key].password === req.body.password) {
        hasEmail = true;
        res.cookie("user_id", users[key].id);
        console.log("everything fine");
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
  res.clearCookie("user_id");
  res.redirect("/urls");
});



app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
