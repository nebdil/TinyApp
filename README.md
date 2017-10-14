# TinyApp project
TinyApp is a full stack web application built with Node and Express that allows users to shorten long URLs (à la bit.ly). I used EJS as the template engine in this project. Furthermore, to secure the passwords provided by the users who would like to use TinyApp, and to secure the cookies I used bcrypt and cookie-session respectively. Making use of this application is easy: you just need to register and login. On the other hand, if you would like to share the shortened URLs with people who are not registered, you can do so, since registration is not mandatory just to use the short versions of otherwise very long URLs, if a registered user sends you the links.

## Final Product
!["index page"](https://github.com/nebdil/tiny-app/blob/master/docs/index.png?raw=true)
!["screenshot description"](#)
!["creating a new short URL"](https://github.com/nebdil/tiny-app/blob/master/docs/newURL.png?raw=true)

## Dependencies
- Node.js
- Express
- EJS
- bcrypt
- body-parser
- cookie-session

## Getting Started

- Install all dependencies (using the `npm install` command)
- Run the development web server using the `node express_server.js` command.
