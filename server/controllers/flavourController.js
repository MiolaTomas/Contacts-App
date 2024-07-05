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


exports.edit = (req, res) =>{
  pool.getConnection((err, connection) =>{
    if(err) throw err; // not connected!
    console.log('Connected as ID ' + connection.threadId);

    // Flavour connection
    connection.query('SELECT * FROM Flavors WHERE id_sabor = ?', [req.params.id], (err, rows) =>{
      connection.release();
      if(!err){
        res.render('edit-flavor', { rows });
      }else{
        console.log(err);
      }
      console.log("Data from flavors table:");
      console.log(rows);
    });
  })
}

//Update
// exports.update = (req, res) => {
//   const { nombre } = req.body;
//   // User the connection
//   pool.getConnection((err, connection) =>{
//   connection.query('UPDATE Flavors SET nombre WHERE id_sabor = ?', [nombre , req.params.id], (err, rows) => {

//     if (!err) {
//       // User the connection
//       connection.query('SELECT * FROM Flavors WHERE id_sabor = ?', [req.params.id], (err, rows) => {
//         // When done with the connection, release it
        
//         if (!err) {
//           res.render('edit-flavor', { rows });
//         } else {
//           console.log(err);
//         }
//         console.log('The data from flavor table: \n', rows);
//       });
//     } else {
//       console.log(err);
//     }
//     console.log('The data from user table: \n', rows);
//   });
//   }
// }

//Update
exports.update = (req, res) => {
  const { nombre } = req.body;

  // Check if nombre is empty
  if (!nombre) {
    return res.render('edit-flavor', { danger: 'Flavor name cannot be empty!' });
  }

  // Get a connection from the pool
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to database:', err);
      return res.render('edit-flavor', { danger: 'Database connection error!' });
    }

    // Perform update query
    connection.query('UPDATE Flavors SET nombre = ? WHERE id_sabor = ?', [nombre, req.params.id], (err, updateResult) => {
      connection.release(); // Release the connection

      if (err) {
        console.error('Error updating flavor:', err);
        return res.render('edit-flavor', { danger: 'Error updating flavor!' });
      }

      // Query the updated flavor
      connection.query('SELECT * FROM Flavors WHERE id_sabor = ?', [req.params.id], (err, selectResult) => {
        connection.release(); // Release the connection

        if (err) {
          console.error('Error selecting flavor:', err);
          return res.render('edit-flavor', { danger: 'Error retrieving updated flavor!' });
        }

        // Render the edit-flavor template with the updated rows
        res.render('edit-flavor', { rows: selectResult , alert: 'User updated successfully!'});
      });
    });
  });
};

//Delete
exports.delete = (req, res) =>{
  pool.getConnection((err, connection) =>{
    if(err) throw err; // not connected!
    console.log('Connected as ID ' + connection.threadId);

    // Flavour connection
    connection.query('DELETE FROM Flavors WHERE id_sabor = ?', [req.params.id], (err, rows) =>{
      connection.release();
      if(!err){
        // res.render('edit-flavor', { rows });
        res.render('home', { alert: 'User deleted successfully!' });
      }else{
        console.log(err);
      }
      console.log("Data from flavors table:");
      console.log(rows);
    });
  })
}


//individualView
exports.individualView = (req, res) =>{
  pool.getConnection((err, connection) =>{
    if(err) throw err; // not connected!
    console.log('Connected as ID ' + connection.threadId);

    // Flavour connection
    connection.query('SELECT * FROM Flavors WHERE id_sabor = ?', [req.params.id], (err, rows) =>{
      connection.release();
      if(!err){
        res.render('view-flavor', { rows });
      }else{
        console.log(err);
      }
      console.log("Data from flavors table:");
      console.log(rows);
    });
  })
}