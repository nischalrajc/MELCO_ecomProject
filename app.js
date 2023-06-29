
const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const logger = require('morgan');
const session = require('express-session');
const moment = require('moment');
const nocache=require('nocache')



const app = express();
dotenv.config({ path: './.env' });

// session created
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true
}));

app.use(nocache());



const usersRouter = require('./routes/user');

const adminRouter = require('./routes/admin');

// Create an instance of Handlebars
const hbs = exphbs.create({
  extname: 'hbs',
  defaultLayout: 'layout',
  layoutsDir: path.join(__dirname, 'views', 'layouts'),
  partialsDir: path.join(__dirname, 'views', 'partials'),
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
  },
  helpers: {
    multiply: function(a, b) {
      return a * b;
    },
    eq: function(a, b) {
      return a === b;
    },
    dateFormatter: function(date, format) {
      return moment(date).format(format);
    },
    indexEquals: function(index, value, options) {
      if (index === value) {
        return options.fn(this);
      } else {
        return options.inverse(this);
      }
    }
    // You can define other helpers here if needed
  },
});


// Set Handlebars as the view engine
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


// mongoose connection
let db = process.env.DATABASE_LOCAL;
mongoose.connect(db, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => { console.log('database connected'); })
  .catch((err) => { console.log(err); });

app.use('/', usersRouter);
app.use('/admin', adminRouter);
app.use('/*',(req,res)=>{
  res.render('user/errorPage')
})

app.listen(3000, () => {
  console.log('server is running on the port 3000');
});
