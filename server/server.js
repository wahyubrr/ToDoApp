const express = require('express')
require('dotenv').config()
const app = express()
const PORT = 4000

var mysql = require('mysql')

app.get('/', (req, res) => {
  // res.send(queryData());
  var con = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  })
  con.connect(function(err) {
    if (err) throw err;
    con.query("SELECT * FROM todolist", function (err, result, fields) {
      if (err) throw err;
      // console.log(result);
      res.send(result);
    });
  });
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})