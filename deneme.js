app.post("/urls/register", (req, res) => {
  users[newId] = {
    id: newId,
    email: rec.body.email,
    password: rec.body.password
  }
  res.cookie("user_id", newId);
  console.log(users[newId]);
  res.redirect("/urls");
});
