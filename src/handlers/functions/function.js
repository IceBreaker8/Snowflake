module.exports = async (client) => {
  client.loadSubcommands = async function (client, interaction, args) {
    try {
      require(`${process.cwd()}/src/commands/${
        interaction.commandName
      }/${interaction.options.getSubcommand()}.js`)(
        client,
        interaction,
        args
      ).catch((err) => {
        client.emit("errorCreate", err, interaction.commandName, interaction);
      });
    } catch {
      //
    }
  };
};
