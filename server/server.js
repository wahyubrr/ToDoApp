require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();
const PORT = process.env.SERVER_PORT

app.use(cors());
app.use(express.json());

var mysql = require('mysql');
const { query } = require('express');

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

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (token == null) return res.sendStatus(401)

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403)
    req.user = user
    next()
  })
}

app.post('/registration', async (req, res) => {
  // Crete user with hashed password by bcrypt
  try {
    const userid = req.body.userid.toLowerCase()
    let query = "SELECT EXISTS(SELECT userid FROM users WHERE userid='" +
      userid + "') AS useridAvailable"
    const useridAvailable = await queryDatabase(query)
    // console.log(useridAvailable[0].useridAvailable)
    if(useridAvailable[0].useridAvailable) {
      return res.status(200).send("UserID is taken")
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    query = "INSERT INTO users ( userid, lastname, firstname, password ) " +
      "VALUES ( '" + userid + "', '" +
      req.body.lastname + "', '" +
      req.body.firstname + "', '" +
      hashedPassword + "')";
    queryDatabase(query)
      .then(
        res.status(201).send("Success inputting user")
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
    let query = "SELECT userid, password FROM users WHERE userid='" + req.body.userid + "'"
    let result = await queryDatabase(query)
    if (result[0] == null) {
      return res.status(200).send("User not found")
    }
    if (await bcrypt.compare(req.body.password, result[0].password)) {
      let accessToken = jwt.sign(req.body.userid, process.env.ACCESS_TOKEN_SECRET)
      return res.json({ accessToken: accessToken })
      // return res.status(200).send("Log-in success!")
    } else {
      return res.status(200).send("Password did not match!")
    }
  }
  catch {
    res.status(500).send("Internal server error")
  }
})

app.get('/user', (req, res) => {
  queryDatabase("SELECT * FROM users")
    .then(
      result => res.send(result)
    )
    .catch(
      err => res.send(err)
    );
})

app.get('/user/:userid', (req, res) => {
  queryDatabase("SELECT * FROM users WHERE userid=" + mysql.escape(req.params.userid))
    .then(
      result => {
        if(result[0] == null) res.status(404).send(result)
        else res.send(result)
      }
    )
    .catch(
      err => res.send(err)
    )
})

app.delete('/user/delete', authenticateToken, async (req, res) => {
  try {
    let query = "SELECT EXISTS(SELECT userid FROM users WHERE userid='" +
      req.user + "') AS useridExist"
    const useridOnDatabase = await queryDatabase(query)
    
    if (useridOnDatabase[0].useridExist) {
      query = "DELETE FROM todolist WHERE userid='" + req.user + "'"
      await queryDatabase(query)

      query = "DELETE FROM users WHERE userid='" + req.user + "'"
      await queryDatabase(query)

      res.status(200).send("Successfully deleted list for user " + req.user)
    }
    else {
      res.sendStatus(403)
    }
  }
  catch {
    res.sendStatus(500)
  }
})

app.get('/todo', authenticateToken, async (req, res) => {
  try {
    let query = "SELECT EXISTS(SELECT userid FROM users WHERE userid='" +
      req.user + "') AS useridExist"
    const useridOnDatabase = await queryDatabase(query)
    
    if (useridOnDatabase[0].useridExist) {
      query = "SELECT * FROM todolist WHERE userid='" + req.user + "'"
      const queriedData = await queryDatabase(query)
      res.status(200).send(queriedData)
    }
    else {
      res.sendStatus(403)
    }
  }
  catch {
    res.sendStatus(500)
  }
})

app.post('/todo/add', authenticateToken, async (req, res) => {
  try {
    let query = "SELECT EXISTS(SELECT userid FROM users WHERE userid='" +
      req.user + "') AS useridExist"
    const useridOnDatabase = await queryDatabase(query)
    
    if (useridOnDatabase[0].useridExist) {
      const today = new Date().toISOString().slice(0, 10)
      query = "INSERT INTO todolist " +
      "( userid, dateassigned, descriptions, completed ) " +
      "VALUES('" + req.user + "', '" + today + "', " + mysql.escape(req.body.descriptions) + 
      ", " + mysql.escape(req.body.completed) + ")"
      const queriedData = await queryDatabase(query)
      res.sendStatus(200)
    }
    else {
      res.sendStatus(403)
    }
  }
  catch {
    res.sendStatus(500)
  }
})

// app.post('/todo/delete', authenticateToken, async (req, res) => {
//   try {
//     let query = "SELECT EXISTS(SELECT userid FROM users WHERE userid='" +
//       req.user + "') AS useridExist"
//     const useridOnDatabase = await queryDatabase(query)
    
//     if (useridOnDatabase[0].useridExist) {
//       const today = new Date().toISOString().slice(0, 10)
//       query = "INSERT INTO todolist " +
//       "( userid, dateassigned, descriptions, completed ) " +
//       "VALUES('" + req.user + "', '" + today + "', " + mysql.escape(req.body.descriptions) + 
//       ", " + mysql.escape(req.body.completed) + ")"
//       const queriedData = await queryDatabase(query)
//       res.sendStatus(200)
//     }
//     else {
//       res.sendStatus(403)
//     }
//   }
//   catch {
//     res.sendStatus(500)
//   }
// })

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})