const express = require("express");
const app = express();
const port = 8000;
const expressLayouts = require('express-ejs-layouts');
const authMiddleware = require('./config/authMiddleware');
const cookieParser = require('cookie-parser');

app.use(express.urlencoded());

app.use(express.static('assets'));
app.use(cookieParser());

app.set('view engine', 'ejs');
app.set('views', './views');


app.use(expressLayouts);
// extract style and scripts from sub pages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

app.use('/', require('./routes/home'));

app.use(authMiddleware.authenticateUser);

app.listen(port, (err) => {
    if (err) {
        return console.log(err);
    }
    console.log("Listening to port: ", port);
});