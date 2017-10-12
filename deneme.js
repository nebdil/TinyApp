app.post("/urls/register", (req, res) => {
  let newId = generateRandomString();
  for (key in users) {
    console.log(users[key]);
    if (!req.body.email || !req.body.password) {
      res.status(404).send("Sorry, invalid email or password");
    }
    else if (users[key].email === req.body.email) {
      console.log(users[key].email);
      res.status(400).send("Sorry existing email");
    }
    else {
      users[newId] = {
        id: newId,
        email: req.body.email,
        password: req.body.password
      }
      res.cookie("user_id", newId);
      res.redirect("/urls");
    }
  }
});
