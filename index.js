const express = require("express");
const http = require("http");
const api = require("./api");
const app = express();
let dbStatusCode = 0;

// Establish connection to the cluster
api.asConnect(function(error) {
  if (error) {
    // handle failure
    dbStatusCode = error.code;
    console.log("Connection to Aerospike cluster failed!");
  } else {
    // handle success
    console.log("Connection to Aerospike cluster succeeded!");
  }
});

// Setup default/home route
app.get("/", function(req, res) {
  res.send(
    '<div><form action="/write"><label>Enter your name:</label><input type="text" name="name"/><input type="submit"></input></form></div>'
  );
});

// Setup write route
app.get("/write", function(req, res) {
  if (dbStatusCode === 0) {
    api.writeRecord('hello', req.query.name, function(error, result) {
      if (error) {
        // handle failure
        console.log('Error in wirte: ', error.message);
        res.send(error.message);
      } else {
        // handle success
        api.readRecord('hello', function(error, result) {
          if (error) {
            // handle failure
            console.log('Error in read: ', error.message);
            res.send(error.message);
          } else {
            // handle success
            res.send(result);
          }          
        });
      }
    });
  } else {
    res.send("Connection to Aerospike cluster failed!");
  }
});

// Setup read route
app.get("/read", function(req, res) {
    if (dbStatusCode === 0) {
        api.readRecord('hello', function(error, result) {
            if (error) {              
              // handle failure
              console.log('Error in read: ', error.message);
              res.send(error.message);
            } else {
              // handle success
              res.send(result);
            }            
          });
    } else {
      res.send("Connection to Aerospike cluster failed!");
    }
});


// Start server
let server = http.Server(app);
server.listen("9000", "localhost", function() {
  console.log(
    "App is running on http://localhost:9000. Press Ctrl-C to exit..."
  );
});
