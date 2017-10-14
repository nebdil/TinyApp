//requirements
const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080;
const bodyParser = require("body-parser");
const cookieSession = require('cookie-session');
const bcrypt = require('bcrypt');
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({name: 'session', keys: ['key1']}));
app.set("view engine", "ejs");

//databases
const urlDatabase = { //database of all the short URLS that have been created
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
const users = { //login information of all the users
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "$2a$10$hj6AjdzmiZUm.eB9ptFPkunVwnMwo4ZwEpvd6Q7AgOFxBiPdA9jKO"
  },
 "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "$2a$10$1tLuMRLTz40gug4jv90NEONB4EVIKClzfMpjSQDF.WW8w0Gz.G7Ie"
  }
};

//functions
function generateRandomString() { //generates a random string for the short URL
    var str = "";
    var char = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for(var i = 0; i < 6; i++) {
        str += char.charAt(Math.floor(Math.random() * char.length));
    }
    return str;
}
function urlsForUser(id) { //returns the subset of the URL database that belongs to the user with ID
  var filteredURL =  {};
  for (var key in urlDatabase) {
    if (urlDatabase[key].userID === id) {
      filteredURL[key] = {
        long: urlDatabase[key].long,
        short: urlDatabase[key],
        userID: urlDatabase[key].userID
      };
    }
  }
  return filteredURL;
}

//get requests
app.get("/urls/register", (req, res) => { //if registered in directs to urls, if not to registration page
  let templateVars = {
    user: users[req.session.user_id]
  };
  req.session.user_id ? res.redirect("/urls") : res.render("urls_registration", templateVars);
});
app.get("/", (req, res) => { //if logged in directs to the urls page, if not to login page
  req.session.user_id ? res.redirect("/urls") : res.redirect("/login");
});
app.get("/u/:id", (req, res) => {//if short URL exists, directs you to the real webpage, if not gives an error
  let templateVars = {
    urls: urlDatabase,
    user: users[req.session.user_id],
    errorMessages: "Sorry this URL does not exist."
  };
  let shortURL = urlDatabase[req.params.id];
  shortURL ? res.redirect(shortURL.long) : res.render("urls_error", templateVars);
});
app.get("/urls", (req, res) => {//if not logged in, gives an error, if logged in, to the index page
  let templateVars = {
    urls: urlsForUser(req.session.user_id),
    user: users[req.session.user_id],
    errorMessages: "You have to login or register to continue."
  };
  !req.session.user_id ? res.render("urls_error", templateVars) : res.render("urls_index", templateVars);
});
app.get("/urls/new", (req, res) => {//if logged in directs to the page to create new short URLs, if not to login page
  let templateVars = {
    user: users[req.session.user_id]
  };
  req.session.user_id ? res.render("urls_new", templateVars) : res.redirect("/login");
});
app.get("/urls/:id", (req, res) => {//if logged in and if this short URL is created by the user, directs to the page where shortURL is shown and can be edited, if it is not yours, gives an error, if the user is not logged in gives an error
  let templateVars = {
    shortURL: req.params.id,
    urls: urlDatabase,
    user: users[req.session.user_id]
  };
  if (urlDatabase[req.params.id]) {
    if (req.session.user_id) {
      if (req.session.user_id === urlDatabase[req.params.id].userID) {
        res.render("urls_show", templateVars);
      } else {
        templateVars.errorMessages = "Sorry, this shortened URL is not yours to access.";
        res.render("urls_error", templateVars);
      }
    } else {
      templateVars.errorMessages = "Sorry, you are not logged in. Log in or register to access.";
      res.render("urls_error", templateVars);
    }
  } else {
    templateVars.errorMessages = "Sorry, this id does not exist.";
    res.render("urls_error", templateVars);
  }
});
app.get("/login", (req, res) => {//if logged in directs to the urls page, if not to the login page
  let templateVars = {
    user: users[req.session.user_id]
  };
  req.session.user_id ? res.redirect("/urls") : res.render("urls_login", templateVars);
});

//post requests
app.post("/urls/register", (req, res) => {//hashes the password, if the email is already used, gives an error, if invalid email or password is given, gives an error, if a new user, registers by generating a new id for the users
  const password = req.body.password;
  const hashedPassword = bcrypt.hashSync(password, 10);
  let newId = generateRandomString();
  let templateVars = {
    user: users[req.session.user_id]
  };
  for (let key in users) {
    if (users[key].email === req.body.email) {
      templateVars.errorMessages = "Sorry, existing email";
      return res.render("urls_error", templateVars);
    }
  }
  if (!req.body.email || !req.body.password) {
    templateVars.errorMessages = "Sorry, invalid email or password";
    res.render("urls_error", templateVars);
  } else {
      users[newId] = {
        id: newId,
        email: req.body.email,
        password: hashedPassword
      };
      req.session.user_id = newId;
      res.redirect("/urls");
    }
});
app.post("/urls", (req, res) => {//if the users wants to create a short url, and if they are signed in they will be redirected to the newly generated short URL page, if not logged in, an error will be given
  let newShortURL = generateRandomString();
  urlDatabase[newShortURL] = {
    short: newShortURL,
    long: req.body.longURL,
    userID: req.session.user_id
  };
  let templateVars = {
    user: users[req.session.user_id],
    errorMessages: "Sorry you need to be logged in to create a shortened URL."
  };
  req.session.user_id ? res.redirect(`urls/${newShortURL}`) : res.render("urls_error", templateVars);
});
app.post("/urls/:id", (req, res) => {//if user is logged in and if it is their short url, they can edit and be redirected to the urls page, if they are logged in but it is not their short URL an error will be returned, if not logged in an error will be returned
  let templateVars = {
    user: users[req.session.user_id],
  };
  if (req.session.user_id) {
    if (req.session.user_id === urlDatabase[req.params.id].userID) {
      urlDatabase[req.params.id].long = req.body.inputURL;
      res.redirect("/urls");
    } else {
      templateVars.errorMessages = "Sorry this is not your URL.";
      res.render("urls_error", templateVars);
    }
  } else {
    templateVars.errorMessages = "You have to login to continue.";
    res.render("urls_error", templateVars);
  }
});
app.post("/urls/:id/delete", (req, res) => {//if logged in and short URL is yours, can delete and be directed to urls page, if logged in and not yours an error will return, if not logged in an error will return
  let templateVars = {user: users[req.session.user_id]};
  if (req.session.user_id) {
    if (req.session.user_id === urlDatabase[req.params.id].userID) {
      delete urlDatabase[req.params.id];
      res.redirect("/urls");
    } else {
      templateVars.errorMessages = "Sorry this is not your URL.";
      res.render("urls_error", templateVars);
    }
  } else {
    templateVars.errorMessages= "You have to login to continue.";
    res.render("urls_error", templateVars);
  }
});
app.post("/login", (req, res) => {//if already registered and every info provided is correct, redirected to the home page, if any info is wrong, error message is returned
  let email = req.body.email;
  let password = req.body.password;
  let templateVars = {
    user: users[req.session.user_id],
    errorMessages: "Sorry, either the email or the password does not match"
  };
  for (let key in users) {
    if(users[key].email === email && bcrypt.compareSync(password, users[key].password)) {
      req.session.user_id = users[key].id;
      return res.redirect("/");
    }
  }
  res.render("urls_error", templateVars);
});
app.post("/logout", (req, res) => {//cookies are erased when the user is logged out and redirected to the urls page
  req.session = null;
  res.redirect("/urls");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
