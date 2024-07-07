const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mysql = require('mysql2');
const port = process.env.PORT || 3000; 
const app = express();


app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));


const handlebars = exphbs.create({ extname: '.hbs',});
app.engine('.hbs', handlebars.engine);
app.set('view engine', '.hbs');

require('dotenv').config();


const flavours = require('./server/routes/flavours');
app.use('/', flavours);

const authRoutes = require('./server/routes/authRoutes');
app.use('/', authRoutes);

app.listen(port, () =>{
  console.log(`Listening on port ${port}`)
  //Curly brackets = alt+123, alt+125
  //Backticks = alt+96
})


