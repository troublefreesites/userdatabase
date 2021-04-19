const express = require('express');
const app = express();
const port = 4000;
const bodyParser = require('body-parser');
var mysql      = require('mysql');
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

const newConn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root"
});

newConn.connect(function(err){
    if(err) throw err;
    console.log("connected");
    newConn.query('CREATE DATABASE IF NOT EXISTS usernames', (err, result) => {
        if(err) throw err;
        console.log(result);
        });
    newConn.query('CREATE TABLE IF NOT EXISTS usernames.users (id INT AUTO_INCREMENT, first_name VARCHAR(255), last_name VARCHAR(255), email VARCHAR(255), PRIMARY KEY (id))', (err, result) => {
        if(err) throw err;
        console.log(result);
        });
    
    });


app.get('/', (req, res) => {
    let sql = 'SELECT * from usernames.users';
    newConn.query(sql, (err, result, cols) => {
        if(err) throw err;
        
        let ft = result;
        res.render('index', {ft});
    });
});

app.get('/add', (req, res) => {
    res.render('add');
});

app.post('/addnew', (req, res) => {
   console.log(req.body.fname);
   let newUser = req.body;
   console.log(newUser);
   const sqlNew = 'INSERT INTO usernames.users SET ?';
   newConn.query(sqlNew, newUser, (err, result) => {
      if(err) throw err;
      console.log(result);
      res.writeHead(302, {location: '/'});
      res.end();
    });
});


app.get('/todelete/:id', (req, res) => {
    let toDel = req.params.id;
    console.log(toDel);
    const sqlDel = 'DELETE FROM usernames.users WHERE id = ?';
    newConn.query(sqlDel, toDel, (err, result) => {
        if(err) throw err;
        console.log(result);
    res.writeHead(302, {location: '/'});
    res.end();
    });
});

app.get('/edit/:id', (req, res) => {
    console.log(req.params.id);
    let getId = req.params.id;
    let sqlGetId = 'SELECT * FROM usernames.users WHERE id = ?';
    newConn.query(sqlGetId, getId, (err, result) => {
        if(err) throw err;
       console.log(result);
       let toUpdate = result;
       console.log(toUpdate);
       res.render('edit', {toUpdate});
    });
    
});

app.post('/update/:id', (req, res) => {
    console.log(req.params.id);
    let userId = req.params.id
    let toUpdate = req.body;
    console.log(toUpdate);
    let sql = "update usernames.users SET first_name='"+req.body.first_name+"',  last_name='"+req.body.last_name+"',  email='"+req.body.email+"' where id ="+userId;
    newConn.query(sql, (err, result) => {
        if(err) throw err;
       console.log(result);
       res.writeHead(302, {location: '/'});
    res.end();
    });
    
   
});

app.listen(port, () => console.log('Example app listening on port 4000!'));