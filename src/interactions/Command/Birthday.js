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
        .setDescription("Add your own birthday to Snowflake")
        .addStringOption((option) =>
          option
            .setName("day")
            .setDescription("The day of the birth date")
            .setRequired(true)
            .setMaxLength(2)
        )
        .addStringOption((option) =>
          option
            .setName("month")
            .setDescription("The month of the birth date")
            .setRequired(true)
            .setMaxLength(2)
        )
        .addStringOption((option) =>
          option
            .setName("year")
            .setDescription("The year of the birth date")
            .setMaxLength(4)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("remove")
        .setDescription("Remove your birthday from Snowflake")
    )
    .addSubcommand((subcommand) =>
      subcommand.setName("view").setDescription("View your set birthday")
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("set-visibility")
        .setDescription("Set your birthday visibility to public or private")
        .addStringOption((option) =>
          option
            .setName("visibility")
            .setDescription("Choose public or private")
            .setRequired(true)
            .addChoices(
              { name: "public", value: "public" },
              { name: "private", value: "private" }
            )
        )
    )
    /*.addSubcommand((subcommand) =>
      subcommand
        .setName("list")
        .setDescription("View the list of all publicly set birthdays")
    ),*/
    .addSubcommand((subcommand) =>
      subcommand
        .setName("lookup")
        .setDescription("Check a user's birthday if its set to public")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("The year of the birth date")
            .setRequired(true)
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
