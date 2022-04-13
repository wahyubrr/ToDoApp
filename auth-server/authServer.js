const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();
const PORT = process.env.AUTH_SERVER_PORT

app.use(cors());
app.use(express.json());

var mysql = require('mysql');

function queryDatabase(query) {
  return new Promise((resolve, reject) => {
    let con = mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    })
    con.connect(function(err) {
      if (err) throw err;
      con.query(query, function (err, result, fields) {
        if (err) {
          reject(err);
          return
        }
        resolve(result);
      });
    });
  })
}

app.post('/token', async (req, res) => {
  try {
    const refreshToken = req.body.token
    if(refreshToken == null) return res.sendStatus(401)

    let query = "SELECT EXISTS(SELECT refreshtoken FROM RefreshTokenTable WHERE refreshtoken='" + refreshToken + "') AS refreshTokenExist"
    const refreshTokenExist = await queryDatabase(query)
    if (!refreshTokenExist[0].refreshTokenExist) return res.sendStatus(403)
    
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) return res.sendStatus(403)
      const accessToken = generateAccessToken(user)
      return res.json ({ accessToken: accessToken })
    })
  }
  catch (err) {
    console.log(err)
    res.sendStatus(500)
  }
})

app.post('/registration', async (req, res) => {
  // Crete user with hashed password by bcrypt
  try {
    const userid = req.body.userid.toLowerCase()
    let query = "SELECT EXISTS(SELECT userid FROM Users WHERE userid='" +
      userid + "') AS useridAvailable"
    const useridAvailable = await queryDatabase(query)
    // console.log(useridAvailable[0].useridAvailable)
    if(useridAvailable[0].useridAvailable) {
      return res.status(401).send("UserID is taken")
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    query = "INSERT INTO Users ( userid, lastname, firstname, password ) " +
      "VALUES ( '" + userid + "', '" +
      req.body.lastname + "', '" +
      req.body.firstname + "', '" +
      hashedPassword + "')";
    queryDatabase(query)
      .then(
        res.status(201).send("Account created!")
      )
      .catch(
        err => res.status(400).send(err)
      );
  } catch {
    res.status(500).send("Query failed")
  }
})

app.post('/login', async (req, res) => {
  // Authenticate User with hashed password by bcrypt
  try {
    let query = "SELECT userid, password FROM Users WHERE userid='" + req.body.userid + "'"
    let result = await queryDatabase(query)
    if (result[0] == null) {
      return res.status(401).send("User not found")
    }
    if (await bcrypt.compare(req.body.password, result[0].password)) {
      const accessToken = generateAccessToken(req.body.userid)
      const refreshToken = jwt.sign(req.body.userid, process.env.REFRESH_TOKEN_SECRET)

      let query = "SELECT EXISTS (SELECT refreshtoken FROM  RefreshTokenTable WHERE refreshtoken='" + refreshToken + "') AS refreshTokenExist"
      const refreshTokenExist = await queryDatabase(query)
      if (!refreshTokenExist[0].refreshTokenExist) {
        query = "INSERT INTO RefreshTokenTable (refreshtoken) VALUES ('" +
        refreshToken + "')"
        await queryDatabase(query)
      }

      return res.json({ accessToken: accessToken, refreshToken: refreshToken })
      // return res.status(200).send("Log-in success!")
    } else {
      return res.status(401).send("Password did not match!")
    }
  }
  catch (err) {
    console.log(err)
    res.status(500).send("Internal server error: " + err)
    // err => res.status(500).send(err)
  }
})

app.delete('/logout', async (req, res) => {
  try {
    const query = "DELETE FROM RefreshTokenTable WHERE refreshtoken='" + req.body.token + "'"
    await queryDatabase(query)
    res.sendStatus(200)
  }
  catch {
    res.sendStatus(500)
  }
})

function generateAccessToken(user) {
  return jwt.sign({ userid: user }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30m' })
}

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})