const express = require("express");
const app = express();
const expressLayouts = require('express-ejs-layouts');
const port = 8000;
const authMiddleware = require('./config/authMiddleware');

app.use(express.urlencoded());

app.use(express.static('assets'));

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