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
        password: hashedPassword;
      }
      res.cookie("user_id", newId);
      res.redirect("/urls");
    }
});
