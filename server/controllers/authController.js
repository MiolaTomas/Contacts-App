const mysql = require('mysql2');
const bcrypt = require('bcrypt');

const pool = mysql.createPool({
  connectionLimit: 100,
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'products'
});

module.exports.signupGet = (req, res) =>{
  res.render('auth/signup.hbs');
}

module.exports.loginGet = (req, res) =>{
  res.render("auth/login.hbs")
}

module.exports.signupPost = (req, res) =>{
  const { email, password } = req.body;
  const hashedpassword = bcrypt.hashSync(password, 10);

  pool.getConnection((err, connection) =>{ 
    if(err) throw err; // not connected!
    console.log('Connected as ID ' + connection.threadId);
    connection.query('INSERT INTO users SET email = ?, password = ?', [email, hashedpassword],(err, rows) =>{
      connection.release();
      if(!err){
        // res.status(201).json(rows);
        res.redirect("/login");
      }else{
        res.status(400).send('error, user not created');
      }
    });
  })
}


module.exports.loginPost = (req, res) => {
  const { email, password } = req.body;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error getting connection from pool', err);
      return res.status(500).send('Database error');
    }
    // Querying user based on email
    connection.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
      connection.release(); // Release the connection

      if (err) {
        console.error('Error querying database', err);
        return res.status(500).send('Database error');
      }

      if (results.length === 0) {
        return res.status(401).send('User not found');
      }

      const user = results[0]; // Assuming email is unique, we take the first result

      // Compare hashed password with plaintext password
      const isValidPassword = bcrypt.compareSync(password, user.password);

      if (isValidPassword) {
        // Passwords match, handle successful login
        // res.status(200).json(user);
        res.redirect("/flavor");
      } else {
        // Passwords do not match
        res.status(401).send('Invalid password');
      }
    });
  });
};