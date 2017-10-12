// <header> Tiny App </header>
// <% if(!username) { %>
//    <form method = "POST" action = "/login">
//      <input type = "text" name = "username" placeholder="username">
//      <button type = "submit"> SUBMIT </button>
//    </form>
// <% } else { %>
//    <p>You are: <%= username %></p>
//    <form method = "POST" action = "/logout">
//      <button type = "submit"> LOGOUT </button>
//    </form>
// <% } %>

// app.post("/login", (req, res) => {
//   res.cookie("username", req.body["username"]);
//   res.redirect("/urls");
// });

// app.post("/logout", (req, res) => {
//   res.clearCookie("username", req.body["username"]);
//   res.redirect("/urls");
// });

app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/urls");
});

user: users[req.cookies["user_id"]]

app.post("/urls/register", (req, res) => {
  let newId = generateRandomString();
  for (key in users) {
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
