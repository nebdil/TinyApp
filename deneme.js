app.post("/login", (req, res) => {
  let hasEmail = false;
  for (let key in users) {
    if (users[key].email === req.body.email) {
      if (bcrypt.compareSync(req.params.password, hashedPassword)) {
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
