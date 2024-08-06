const Discord = require("discord.js");
const { Events, REST } = require("discord.js");
const { Routes } = require("discord.js");
const chalk = require("chalk");
const fs = require("fs");

module.exports = (client) => {
  const commands = [];

  // loading commands message
  console.log(
    chalk.blue(chalk.bold(`System`)),
    chalk.white(`>>`),
    chalk.green(`Loading commands`),
    chalk.white(`...`)
  );

  // loading all commands directories
  fs.readdirSync("./src/interactions").forEach((dirs) => {
    const commandFiles = fs
      .readdirSync(`./src/interactions/${dirs}`)
      .filter((files) => files.endsWith(".js"));

    // notify that command directories are loaded
    console.log(
      chalk.blue(chalk.bold(`System`)),
      chalk.white(`>>`),
      chalk.red(`${commandFiles.length}`),
      chalk.green(`commands of`),
      chalk.red(`${dirs}`),
      chalk.green(`loaded`)
    );
    //////////////////////////////////////// LOAD ALL COMMANDS HERE ////////////////////////////////////////////////////
    for (const file of commandFiles) {
      const command = require(`${process.cwd()}/src/interactions/${dirs}/${file}`);
      // you need to register the "data" of the command, and the "run" to run it under interactionCreate event
      if ("data" in command && "run" in command) {
        // register "data"
        client.commands.set(command.data.name, command);
        commands.push(command.data.toJSON());
        // register "run"
        client.on(Events.InteractionCreate, (interaction) => {
          command.run(client, interaction, null);
        });
        //
      } else {
        console.log(
          `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
        );
      }
    }
  });

  const rest = new REST({ version: "9" }).setToken(process.env.TOKEN);

  (async () => {
    try {
      console.log(
        `Started refreshing ${commands.length} application (/) commands.`
      );
      await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
        body: commands,
      });
      console.log(
        `Successfully reloaded ${commands.length} application (/) commands.`
      );
    } catch (error) {
      console.log(error);
    }
  })();
};
