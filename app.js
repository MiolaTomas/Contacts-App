const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const port = process.env.PORT || 3000; 
const app = express();


app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use(express.static('public'));


const handlebars = exphbs.create({ extname: '.hbs',});
app.engine('.hbs', handlebars.engine);
app.set('view engine', '.hbs');

require('dotenv').config();





const routes = require('./server/routes/flavours');
app.use('/', routes);





app.listen(port, () =>{
  console.log(`Listening on port ${port}`)
  //Curly brackets = alt+123, alt+125
  //Backticks = alt+96
})


