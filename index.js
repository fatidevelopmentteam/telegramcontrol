const WebSocket = require("ws");
const { writeFile } = require("./DBTools");
const database = require("./history.json");
const databaseURL = "./history.json";
let lastToday = null;
const addToDay = (ToDay = lastToday) => {
  lastToday = ToDay;
  let newDB = database,
  todayIndex = database.findIndex((e)=> e.id == ToDay);
  if (database[todayIndex]) {
    newDB[todayIndex].end = Date.now();
    writeFile(databaseURL, newDB);
  } else {
    newDB.push({id:ToDay, start: Date.now(), end: null });
    writeFile(databaseURL, newDB);
  }
};

const wsServer = new WebSocket.Server({ port: 2993 });
wsServer.on("connection", (wsClient) => {
  wsClient.on("message", (data) => {
    if (data.toString() == 'gethistory') {
        wsClient.send(JSON.stringify(database))
    }else {
        addToDay(JSON.parse(data.toString()).now)
    }
  });
  wsClient.on("close", (event) => {
    addToDay();
  });
});


module.exports = {};
