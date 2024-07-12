const jwt = require('jsonwebtoken');

const validateToken = (req, res, next) => {
  const token = req.cookies.accessToken;
  
  console.log("token that comes from the cookie:" + token);
  if (!token) {
      return res.status(401).send('Access Denied: No token provided');
  }
  try {
      const validToken = jwt.verify(token, process.env.JWT_TOKEN);
      if (validToken){
        req.authenticated = true;
        req.user = validToken; // Attach the decoded token payload to req.user
        console.log('User ID:', req.user.userId); // Log the user ID
        next();
      }
  } catch (err) {
      return res.status(400).send('Invalid Token');
  }
};

module.exports = { validateToken }