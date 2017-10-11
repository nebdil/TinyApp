app.post("/urls/:id", (req, res) => {
  urlDatabase[req.params.id] = req.body;
  res.redirect("/urls");
});
