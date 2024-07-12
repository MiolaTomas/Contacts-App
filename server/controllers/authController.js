const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const { sign, verify} = require('jsonwebtoken');
const jwt = require('jsonwebtoken');

const pool = mysql.createPool({
  connectionLimit: 100,
  host: process.env.HOST,
  port: process.env.PORT,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE
});

module.exports.signupGet = (req, res) =>{
  res.render('auth/signup.hbs');
}

module.exports.loginGet = (req, res) =>{
  res.render("auth/login.hbs")
}

// module.exports.signupPost = (req, res) =>{
//   const { email, password } = req.body;
//   const hashedpassword = bcrypt.hashSync(password, 10);

//   pool.getConnection((err, connection) =>{ 
//     if(err) throw err; // not connected!
//     console.log('Connected as ID ' + connection.threadId);
//     connection.query('INSERT INTO users SET email = ?, password = ?', [email, hashedpassword],(err, rows) =>{
//       connection.release();
//       if(!err){
//         res.redirect("/flavor");
//       }else{
//         res.status(400).send('error, user not created');
//       }
//     });
//   })

// POST /register - Register a new user and generate JWT
module.exports.signupPost =  async (req, res) => {
  const { email, password } = req.body;
  try {
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert new user into MySQL database
      pool.getConnection((err, connection) => {
          if (err) {
              throw err;
          }

          connection.query('INSERT INTO users (email, password) VALUES (?, ?)', [email, hashedPassword], (err, rows) => {
              connection.release(); // Release connection
              if (err) {
                  console.error(err);
                  return res.status(400).send('Error, user not created');
              }

              // Generate JWT token with userId
              const userId = rows.insertId; // Get auto-generated userId
              const token = jwt.sign({ userId }, process.env.JWT_TOKEN, { expiresIn: '1h' });

              // Set the token in an HTTP-only cookie
              res.cookie('accessToken', token, {
                httpOnly: true,
                maxAge: 3600000 // 1 hour
              });

              // res.json({ token, userId });
              res.redirect('/contacts');
          });
      });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
  }
};


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

      const user_jwt = results[0];
      const userId = results[0].id;

      // Compare hashed password with plaintext password
      const isValidPassword = bcrypt.compareSync(password, user_jwt.password);

      if (isValidPassword) {
        const token = jwt.sign({ userId }, process.env.JWT_TOKEN, { expiresIn: '1h' });
        res.cookie('accessToken', token, { httpOnly: true });
        console.log("Token created by the login method: " +  token);
        res.redirect("/contacts");
      } else {
        // Passwords do not match
        res.status(401).send('Invalid password');
      }
    });
  });
};

module.exports.logout = (req, res) => {
  res.clearCookie('accessToken');
  res.clearCookie('user');
  res.redirect('/signup');
}