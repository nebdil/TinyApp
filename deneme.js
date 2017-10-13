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

app.get("/urls/:id", (req, res) => {
  let templateVars = {
    shortURL: req.params.id,
    longURL: urlDatabase[req.params.id],
    user: users[req.session["user_id"]]
  };
  if (urlDatabase[req.params.id]) {
    if (req.session["user_id"]) {
    if (req.session["user_id"] === urlDatabase[req.params.id].userID) {
      res.render("urls_show", templateVars);
    } else {
      res.render("urls_errorNotYours", templateVars);
    }
    } else {
      res.render("urls_error", templateVars);
    }
  } else {
    res.render("urls_errorIdDoesnt", templateVars);
  }
});
