const fs = require("fs");

const writeFile = (filePath, object) => {
  fs.writeFile(filePath, JSON.stringify(object), (err) => {
    if(err) console.log(err);
  });
};
const readFile = (filePath) => {
  fs.readFile(filePath, "utf8", (err, jsonString) => {
    if (err) {
      console.log("File read failed:", err);
      return;
    }
    console.log("File data:", jsonString);
  });
  return jsonString
};

module.exports = { readFile, writeFile };
