# Snowflake

The way commands works:

- In bot.js, I load every single file under the handlers, including functions, commands, events etc... (because requiring the module.exports will activate the code inside the export = {})

```js
// load commands
client.commands = new Collection();

// Load handlers (functions, commands, events, etc...)
fs.readdirSync("./src/handlers").forEach((dir) => {
  fs.readdirSync(`./src/handlers/${dir}`).forEach((handler) => {
    require(`./handlers/${dir}/${handler}`)(client);
  });
});
```

- Then, for commands (for example), the handler => loader => commands.js will load every single file under interactions => Command, this will be the Main Command factory.
- The command factory file will contain:
  -- The `data`, which contains the command name, description, options, subcommands etc...
  -- The `run` function, that replies to the command execution

- Inside the run function, we call another helper function that loads commands => <main-command-name> => <sub-command-name>.js
