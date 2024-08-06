require("dotenv").config();

const path = require("path");
const fs = require("fs");
const { Collection, Events } = require("discord.js");

const { Client, GatewayIntentBits, codeBlock } = require("discord.js");
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

client.on("ready", () => {
  console.log(
    `Starting Snowflake${
      process.env.NODE_ENV == "DEVELOPMENT" ? ".Dev" : ""
    } in ${process.env.NODE_ENV} environment: ${client.user.tag}`
  );
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
//require("./handlers/functions/function.js")(client);

/**
 * register events
 */

// Load events handlers
/*
const eventFiles = fs
  .readdirSync(path.join(__dirname, "events/currency"))
  .filter((file) => file.endsWith(".js"));
for (const file of eventFiles) {
  const event = require(path.join(__dirname, "events/currency", file));
  const eventName = file.split(".")[0];
  client.on(eventName, event.bind(null, client));
}*/
// load commands
client.commands = new Collection();

// Load handlers (functions, commands, events, etc...)
fs.readdirSync("./src/handlers").forEach((dir) => {
  fs.readdirSync(`./src/handlers/${dir}`).forEach((handler) => {
    require(`./handlers/${dir}/${handler}`)(client);
  });
});

// start discord bot connection
client.login(process.env.TOKEN);
