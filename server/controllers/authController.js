const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const { sign, verify} = require('jsonwebtoken');

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
// }
module.exports.signupPost = async (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);

  try {
    // Step 1: Insert new user into the database
    const insertResult = await new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) {
          console.error('Error getting connection from pool', err);
          return reject(err);
        }

        connection.query('INSERT INTO users SET ?', { email, password: hashedPassword }, (err, result) => {
          connection.release(); // Release the connection

          if (err) {
            console.error('Error inserting user', err);
            return reject(err);
          }

          resolve(result);
        });
      });
    });

    // Step 2: Select user by email (for debugging/logging purposes)
    const selectResult = await new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) {
          console.error('Error getting connection from pool', err);
          return reject(err);
        }

        connection.query('SELECT * FROM users WHERE email = ?', [email], (err, rows) => {
          connection.release(); // Release the connection

          if (err) {
            console.error('Error selecting user', err);
            return reject(err);
          }

          resolve(rows[0].id);
        });
      });
    });
    // Log the inserted and selected user
    console.log('Inserted user:', insertResult);
    console.log('Selected user:', selectResult);

    // Generate JWT token for the newly registered user
    const accessToken = sign({ email }, process.env.JWT_TOKEN, { expiresIn: '1h' }); // Example with 1-hour expiration

    // Set JWT token as a cookie
    res.cookie('accessToken', accessToken, { httpOnly: true });
    res.cookie('user', selectResult, { httpOnly: true });

    // Redirect to /flavor route
    res.redirect('/contacts');
  } catch (error) {
    // Handle any errors that occurred during the async operations
    console.error('Error in signup process', error);
    res.status(500).send('Database error');
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
      const user = results[0].id;
      res.cookie('user', user, { httpOnly: true });
      console.log(user); 

      // Compare hashed password with plaintext password
      const isValidPassword = bcrypt.compareSync(password, user_jwt.password);

      if (isValidPassword) {
        const accessToken = sign(user_jwt, process.env.JWT_TOKEN, { expiresIn: '1h' }); // Token expires in 1 hour
        res.cookie('accessToken', accessToken, { httpOnly: true });
        console.log("Token created by the login method: " +  accessToken);
        res.redirect("/flavor");
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