const express = require('express')

var cors = require('cors')
var sq = require('sqlite3');
var users_db = new sq.Database(__dirname + '/users.db3');
var machines_db = new sq.Database(__dirname + '/machines.db3');
var app = express();

// Firebase configuration for push notifications
var admin = require("firebase-admin");
var serviceAccount = require("./serviceAccountKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://notifs-android-dhom.firebaseio.com"
});
const message = {
  notification: {
    title: 'Depuis le serveur NodeJS',
    body: 'Le coeur du message',
  },
  condition: `'washingMachine' in topics`,
};
admin.messaging().send(message)
  .then((resp) => {
    console.log('Message sent successfully:', resp);
  }).catch((err) => {
    console.log('Failed to send the message:', err);
  });


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

app.get('/v1/get-contributors', function(req, res){
  var output = [];

  console.log("get-contributors");
  
  machines_db.each("SELECT * FROM contributors", function(err, row){
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

app.post('/v1/join-machine', function (req, res){
  var content = req.body;

  console.log("join-machines");
  console.log(content);
  res.json(content);

  addContributor(content.body.machineId, content.body.userId, content.body.size);
})

app.listen(3000, function () {
  console.log('Listening on port 3000!');
})


function addMachine(type, size, sheduleTime, createdBy, day, message){
  machines_db.run("INSERT INTO machines(id, size, scheduleTime, type, createdBy, day, message) VALUES(?, ?, ?, ?, ?, ?, ?)", [1, size, sheduleTime, type, createdBy, day, message]);
}

function addContributor(machineId, userId, size){
  machines_db.run("UPDATE machines SET size = size + ? WHERE id = 1", size);
  machines_db.run("INSERT INTO contributors(machine_id, userid, size) VALUES(?, ?, ?)", [machineId, userId, size]);
}

function deleteLastMachine(){
  machines_db.run("DELETE FROM machines WHERE id=1");
  machines_db.run("DELETE FROM contributors WHERE machine_id=1");
}