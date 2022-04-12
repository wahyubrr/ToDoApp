const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();
const PORT = process.env.SERVER_PORT

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
          // console.log(err) // DEBUGGING
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
  // console.log(req.headers) // DEBUGGING
  if (token == null) return res.sendStatus(401)

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403)
    req.user = user.userid
    next()
  })
}

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
      await queryDatabase(query)
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

app.delete('/todo/delete', authenticateToken, async (req, res) => {
  try {
    let query = "SELECT EXISTS(SELECT userid FROM users WHERE userid='" +
      req.user + "') AS useridExist"
    const useridOnDatabase = await queryDatabase(query)
    // Need to check the username == token
    // Welppp it's not working yet lul
    if (useridOnDatabase[0].useridExist) {
      query = "DELETE FROM todolist WHERE todoid='" + mysql.escape(req.body.todoid) + "'"
      await queryDatabase(query)
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

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})