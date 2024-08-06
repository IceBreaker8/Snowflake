const { CommandInteraction, Client } = require("discord.js");
const { SlashCommandBuilder } = require("discord.js");
const { ChannelType } = require("discord.js");
const Discord = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("birthday")
    .setDescription("A birthday discord command")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("set")
        .setDescription("Add your own birthday to snowflake")
        .addStringOption((option) =>
          option
            .setName("day")
            .setDescription("The day of the birth date")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("month")
            .setDescription("The month of the birth date")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option.setName("year").setDescription("The year of the birth date")
        )
    ),
  /**
   * @param {Client} client
   * @param {CommandInteraction} interaction
   * @param {String[]} args
   */ run: async (client, interaction, args) => {
    client.loadSubcommands(client, interaction, args); //
  },
};
