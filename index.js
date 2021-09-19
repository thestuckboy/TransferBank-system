const express = require('express');
const routes = require('./routes/routes');
const passport = require('passport');
const session = require('express-session');

const app = express();

app.set('port', process.env.PORT || 3000);
app.set('view engine', 'ejs');

//Database connect

require('./db/database');

//Authentication Strategies

require('./strategies/auth');

//Middlewares

app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));
app.use(session({
    secret: 'Transfer Key Secret',
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());

//Importing routes:

app.use(routes);

//Listening

app.listen(app.get('port'), ()=>{
    console.log(`Server on port ${app.get('port')}`);
})
