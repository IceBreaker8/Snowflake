const { CommandInteraction, Client } = require("discord.js");
const { SlashCommandBuilder } = require("discord.js");
const { ChannelType } = require("discord.js");
const Discord = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("birthday")
    .setDescription("This is a description")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("add")
        .setDescription("Get information about the giveaway category commands")
    ),
  /**
   * @param {Client} client
   * @param {CommandInteraction} interaction
   * @param {String[]} args
   */ run: async (client, interaction, args) => {
    client.loadSubcommands(client, interaction, args);
  },
};
