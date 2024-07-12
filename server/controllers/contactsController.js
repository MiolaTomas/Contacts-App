const mysql = require('mysql2');

const pool = mysql.createPool({
  connectionLimit: 100,
  host: process.env.HOST,
  port: process.env.PORT,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE
});

// View Flavours
exports.view = (req, res) =>{
  const user = req.user.userId;
    //Connect to DB
    pool.getConnection((err, connection) =>{
      if(err) throw err; // not connected!
      console.log('Connected as ID ' + connection.threadId);

      // Flavour connection
      connection.query('SELECT * FROM contacts WHERE user_id = ?' ,[user], (err, rows) =>{
        connection.release();
        if(!err){
          res.render('home', { rows });
        }else{
          console.log(err);
        }
        console.log("Data from contacts table:");
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
    connection.query('SELECT * FROM contacts WHERE name LIKE ?', ['%' + searchTerm + '%'], (err, rows) =>{
      connection.release();
      if(!err){
        res.render('home', { rows });
      }else{
        console.log(err);
      }
      console.log("Data from contacts table:");
      console.log(rows);
    });
  })
}

exports.create = (req, res) =>{
  const { name, address, phone } = req.body;
  const user = req.user.userId;
  if (!name || !address || !phone) {
    return res.render('add-contact', { danger: 'Name can not be empty' });
  }
  pool.getConnection((err, connection) =>{
    if(err) throw err; // not connected!
    console.log('Connected as ID ' + connection.threadId);
    // Flavour connection
    connection.query('INSERT INTO contacts SET name = ?, address = ?, phone = ?, user_id = ?', [name, address, phone, user], (err, rows) => {
      connection.release();
      if(!err){
        res.render('add-contact', { alert: 'User added successfully!'});
      }else{
        console.log(err);
      }
    });
  })
}

exports.form = (req, res) =>{
  res.render('add-contact');
}


exports.edit = (req, res) =>{
  pool.getConnection((err, connection) =>{
    if(err) throw err; // not connected!
    console.log('Connected as ID ' + connection.threadId);

    // Flavour connection
    connection.query('SELECT * FROM contacts WHERE id = ?', [req.params.id], (err, rows) =>{
      connection.release();
      if(!err){
        res.render('edit-contact', { rows });
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
  const { name, address, phone } = req.body;

  // Check if nombre is empty
  if (!name) {
    return res.render('edit-contact', { danger: 'Name cannot be empty!' });
  }

  // Get a connection from the pool
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to database:', err);
      return res.render('edit-contact', { danger: 'Database connection error!' });
    }

    // Perform update query
    connection.query('UPDATE contacts SET name = ?, address = ?, phone = ?  WHERE id = ?', [name, address, phone, req.params.id], (err, updateResult) => {

      connection.release(); // Release the connection

      if (err) {
        console.error('Error updating contact:', err);
        return res.render('edit-contact', { danger: 'Error updating contact!' });
      }

      // Query the updated flavor
      connection.query('SELECT * FROM contacts WHERE id = ?', [req.params.id], (err, selectResult) => {
        connection.release(); // Release the connection

        if (err) {
          console.error('Error selecting flavor:', err);
          return res.render('edit-contact', { danger: 'Error retrieving updated contact!' });
        }

        // Render the edit-flavor template with the updated rows
        res.render('edit-contact', { rows: selectResult , alert: 'User updated successfully!'});
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
    connection.query('DELETE FROM contacts WHERE id = ?', [req.params.id], (err, rows) =>{
      connection.release();
      if(!err){
        res.redirect('/contacts');
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
    connection.query('SELECT * FROM contacts WHERE id = ?', [req.params.id], (err, rows) =>{
      connection.release();
      if(!err){
        res.render('view-contact', { rows });
      }else{
        console.log(err);
      }
      console.log("Data from Contacts table:");
      console.log(rows);
    });
  })
}