const fs = require("fs");
const path = require("path");

module.exports = (client) => {
  // load every file under src/events
  fs.readdirSync("./src/events").forEach((dir) => {
    fs.readdirSync(`./src/events/${dir}`).forEach((eventFile) => {
      const event = require(`${process.cwd()}/src/events/${dir}/${eventFile}`);
      const eventName = eventFile.split(".")[0];
      client.on(eventName, event.bind(null, client));
    });
  });
};
