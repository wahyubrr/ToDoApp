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

  // Authorization JWT
  // const username = req.body.username
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
      return res.status(200).send("Log-in success!")
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
      err => console.error(err)
    );
})

app.delete('/user/delete/:userid', (req, res) => {
  let query = "DELETE FROM users WHERE userid=" +
    mysql.escape(req.params.userid);
  queryDatabase(query)
  .then(
    res.status(200).send("Successfully deleted user " + req.params.userid)
  )
  .catch(
    err => console.error(err)
  );
})

app.get('/todo/:userid', (req, res) => {
  queryDatabase("SELECT * FROM todolist WHERE UserId="+mysql.escape(req.params.userid))
    .then(
      result => res.send(result)
    )
    .catch(
      err => console.error(err)
    );
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})