const http = require("http");
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;
//-----
const WebSocket = require("ws");
const { writeFile } = require("./DBTools");
const database = require("./history.json");
const databaseURL = "./history.json";
let lastToday = null;
const addToDay = (ToDay = lastToday) => {
  lastToday = ToDay;
  let newDB = database,
    todayIndex = database.findIndex((e) => e.id == ToDay);
  if (database[todayIndex]) {
    newDB[todayIndex].end = Date.now();
    writeFile(databaseURL, newDB);
  } else {
    newDB.push({ id: ToDay, start: Date.now(), end: null });
    writeFile(databaseURL, newDB);
  }
};

const wsServer = new WebSocket.Server({ port: 2993 });
wsServer.on("connection", (wsClient) => {
  wsClient.on("message", (data) => {
    if (data.toString() == "gethistory") {
      wsClient.send(JSON.stringify(database));
    } else {
      addToDay(JSON.parse(data.toString()).now);
    }
  });
  wsClient.on("close", (event) => {
    addToDay();
  });
});

app.get("/api/gethistory", cors(), (req, res) => {
  res.send(database);
});
app.get("/api/getcurrentsession", cors(), (req, res) => {
  res.send(database[database.findIndex((e) => e.id == lastToday)]);
});

app.listen(port, () => {
  console.log(`Web API is running in port:${port}.`);
});

module.exports = {};
