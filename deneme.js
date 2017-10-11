<header> Tiny App </header>
<% if(!username) { %>
   <form method = "POST" action = "/login">
     <input type = "text" name = "username" placeholder="username">
     <button type = "submit"> SUBMIT </button>
   </form>
<% } else { %>
   <p>You are: <%= username %></p>
   <form method = "POST" action = "/logout">
     <button type = "submit"> LOGOUT </button>
   </form>
<% } %>


app.post("/logout", (req, res) => {
  res.clearCookie("username", req.body["username"]);
  res.redirect("/urls");
});
