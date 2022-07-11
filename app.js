const path = require('path');
const express = require("express");
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override')
const morgan = require('morgan');
const passport = require('passport');
const session = require('express-session')
const MongoStore = require('connect-mongo')
const connectDB = require('./config/db');

//Load config
dotenv.config({path: "./config/config.env"})

//Passport config
require('./config/passport')(passport);

connectDB()

const app = express()

//Body Parser //For POST
app.use(express.urlencoded({extended:false}))
app.use(express.json())

//method override
app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      // look in urlencoded POST bodies and delete it
      let method = req.body._method
      delete req.body._method
      return method
    }
}))

//Logging
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}

//Handlebars Helpers
const{formatDate,stripTags,truncate, editIcon,select} = require('./helpers/hbs')
//Handlebars
app.engine('.hbs', exphbs.engine({helpers:{
    formatDate,
    stripTags,
    truncate,
    editIcon,
    select,
    },
    extname: '.hbs',
    defaultLayout: 'main'
}));
app.set('view engine','.hbs');

//Express session
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false, //don't create session without anything changed
    //cookie: { secure: true } //doesn't work without https
    store: MongoStore.create({mongoUrl: process.env.MONGO_URI,}),
  }))

//Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Set global var
app.use(function(req,res,next){
    res.locals.user = req.user || null
    next()
})

//Static Folder
app.use(express.static(path.join(__dirname,'public')))

//Routes
app.use('/',require('./routes/index'))
app.use('/auth',require('./routes/auth'))
app.use('/stories',require('./routes/stories'))


const PORT = process.env.PORT || 3000 


app.listen(PORT, 
    console.log(`Server runnning in ${process.env.NODE_ENV} mode on port ${PORT}`)
)
