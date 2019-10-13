const express = require('express')

var cors = require('cors')
var sq = require('sqlite3');
var users_db = new sq.Database(__dirname + '/users.db3');
var machines_db = new sq.Database(__dirname + '/machines.db3');
var app = express();

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(cors()) // Active CORS ok pour toute URL

app.get('/v1/users', function (req, res) {
  var output = [];
  users_db.each("SELECT id, username FROM user", function(err, row) {
    if (err) {
        console.log(err);
    } else {
        output.push(row);
    }
  }, function(err, nbresult){
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(output));
  });
})

app.get('/v1/get-machines', function(req, res){
  var output = [];

  machines_db.each("SELECT * FROM machines", function(err, row){
    if (err){
      console.log("Erreur get-machines");
      console.log(err);
    } else {
      output.push(row);
    }
  }, function(err, nbresults){
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(output));
    console.log(JSON.stringify(output));
  });
})

app.post('/v1/add-machines', function (req, res){
  var content = req.body;

  console.log("add-machines");
  console.log(content);
  res.json(content);

  deleteLastMachine();
  addMachine(content.body.type, content.body.size, content.body.sheduleTime, content.body.user, content.body.day, content.body.message);
})

app.post('/v1/update-size', function (req, res){
  var content = req.body;

  console.log("add-machines");
  console.log(content);
  res.json(content);

  machines_db.run("UPDATE machines SET size = size + ? WHERE id = 1", content.body.size);
})

app.listen(3000, function () {
  console.log('Listening on port 3000!');
})


function addMachine(type, size, sheduleTime, createdBy, day, message){
  machines_db.run("INSERT INTO machines(id, size, scheduleTime, type, createdBy, day, message) VALUES(?, ?, ?, ?, ?, ?, ?)", [1, size, sheduleTime, type, createdBy, day, message]);
}

function deleteLastMachine(){
  machines_db.run("DELETE FROM machines WHERE id=1");
}