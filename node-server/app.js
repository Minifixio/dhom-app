const express = require('express')

var cors = require('cors')
var sq = require('sqlite3');
var db = new sq.Database(__dirname + '/users.db3');
var app = express();
let sqlMachines = 'INSERT INTO MACHINES(id, type, size, sheduleTime, createdBy) VALUES';

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(cors()) // Active CORS ok pour toute URL

app.get('/v1/users', function (req, res) {
  var output = [];
  db.each("SELECT id, username FROM user", function(err, row) {
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

app.post('/v1/machines', function (req, res){
  console.log(req.body);
  res.json(req.body);

  var content = req.body;
  deleteLastMachine();
  addMachine(content.body.type, 25, content.body.sheduleTime, content.body.user);
})

app.listen(3000, function () {
  console.log('Listening on port 3000!');
})


function addMachine(type, size, sheduleTime, createdBy){

  /**values = '(1, ' + type + ', ' + size + ', ' + sheduleTime + ', ' + createdBy + ')'
  db.run(sqlMachines, values, function(err) {
    if (err) {
      return console.error(err.message);
    }
    console.log(`Rows inserted ${this.changes}`);
  });*/
  db.run("INSERT INTO machines VALUES(?,?,?,?,?)", [1, type, size, sheduleTime, createdBy]);
}

function deleteLastMachine(){
  db.run("DELETE FROM machines WHERE id=1");
}