const express = require('express')

var cors = require('cors')
var sq = require('sqlite3');
var users_db = new sq.Database(__dirname + '/database/users.db3');
var machines_db = new sq.Database(__dirname + '/database/machines.db3');
var app = express();

// Firebase configuration for push notifications
var admin = require("firebase-admin");
var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://notifs-android-dhom.firebaseio.com"
});

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(cors()) // Active CORS ok pour toute URL


// HTTP GET: return all the users with their id and name
app.get('/v1/users', function (req, res) {
  var output = [];

  console.log("get-users");

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

// HTTP GET: return the current machine
app.get('/v1/get-machines', function(req, res){

  console.log("get-machines");

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
  });
})

// HTTP GET: return all the contributors
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
  });
})

// HTTP POST: add a new machine
app.post('/v1/add-machine', function (req, res){
  var content = req.body.body;

  console.log("add-machines");
  console.log(content);
  res.json(content);

  deleteLastMachine();
  addMachine(content);
  notificationAddMachine(content.creatorId, content.scheduleTime, content.day);
})

// HTTP POST: add a contributor to a machine
app.post('/v1/join-machine', function (req, res){
  var content = req.body;

  console.log("join-machines");
  console.log(content);
  res.json(content);

  addContributor(content.body.machineId, content.body.userId, content.body.size);
})

// Start the express server
app.listen(3000, function () {
  console.log('Listening on port 3000!');
})

// Add a machine with its type, size, schedule time, creator, day and a message (if there is one)
function addMachine(content){
  machines_db.run(
    "INSERT INTO machines(id, size, scheduleTime, typeId, typeName, creatorId, creatorName, day, message, scheduleDate) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", 
    [1, content.size, content.scheduleTime, content.typeId, content.typeName, content.creatorId, content.creatorName, content.day, content.message, content.scheduleDate]
  );
}

// Add a contributor to a machine with a specific machineId
function addContributor(machineId, userId, size){
  machines_db.run("UPDATE machines SET size = size + ? WHERE id = 1", size);
  machines_db.run("INSERT INTO contributors(machine_id, userid, size) VALUES(?, ?, ?)", [machineId, userId, size]);
}

// Delete the last machine (for now, we can only have one machine running at time)
function deleteLastMachine(){
  machines_db.run("DELETE FROM machines WHERE id=1");
  machines_db.run("DELETE FROM contributors WHERE machine_id=1");
}

async function notificationAddMachine(createdBy, scheduleTime, day){

  users_db.get("SELECT username FROM user WHERE id = ?", [createdBy], function(err, row){
    var username = row.username;

    if(day == 'tomorrow'){
      day = "demain";
    }
    if(day == 'today'){
      day = "aujourd'hui"
    }
  
    const message = {
      notification: {
        title: username + ' a ajouté une nouvelle machine !',
        body: 'porgramée pour ' + day + ' à ' + scheduleTime,
      },
      condition: `'washingMachine' in topics`,
    };
  
    admin.messaging().send(message)
    .then((resp) => {
      console.log('Message sent successfully:', resp);
    }).catch((err) => {
      console.log('Failed to send the message:', err);
    });
  });
}

