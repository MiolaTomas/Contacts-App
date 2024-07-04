const { json } = require('body-parser');
const mysql = require('mysql2');

const pool = mysql.createPool({
  connectionLimit: 100,
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'products'
});

// View Flavours

exports.view = (req, res) =>{
    //Connect to DB
    pool.getConnection((err, connection) =>{
      if(err) throw err; // not connected!
      console.log('Connected as ID ' + connection.threadId);

      // Flavour connection
      connection.query('SELECT * FROM Flavors', (err, rows) =>{
        connection.release();
        if(!err){
          res.render('home', { rows });
        }else{
          console.log(err);
        }
        console.log("Data from flavors table:");
        console.log(rows);
      });
    })
}

//search
exports.find = (req, res) =>{
  pool.getConnection((err, connection) =>{
    if(err) throw err; // not connected!
    console.log('Connected as ID ' + connection.threadId);
    let searchTerm = req.body.search;
    // Flavour connection
    connection.query('SELECT * FROM Flavors WHERE nombre LIKE ?', ['%' + searchTerm + '%'], (err, rows) =>{
      connection.release();
      if(!err){
        res.render('home', { rows });
      }else{
        console.log(err);
      }
      console.log("Data from flavors table:");
      console.log(rows);
    });
  })
}

exports.create = (req, res) =>{
  const { nombre } = req.body;
  if (!nombre) {
    return res.render('add-flavor', { danger: 'Flavor name cannot be empty!' });
  }
  pool.getConnection((err, connection) =>{
    if(err) throw err; // not connected!
    console.log('Connected as ID ' + connection.threadId);
    // Flavour connection
    connection.query('INSERT INTO Flavors SET nombre = ?', [nombre],(err, rows) =>{
      connection.release();
      if(!err){
        res.render('add-flavor', { alert: 'User added successfully!'});
      }else{
        console.log(err);
      }
    });
  })
}

exports.form = (req, res) =>{
  res.render('add-flavor');
}
