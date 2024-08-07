const axios = require("axios");
const { EmbedBuilder } = require("discord.js");

// Create an Axios instance with strapi api token
const backUrl = process.env.API_URL;

const axiosInstance = axios.create({
  headers: {
    Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
    "Content-Type": "application/json",
  },
});

module.exports = async (client, interaction, args) => {
  // check if discord member has the Snowflake Birthday role
  const userId = interaction.user.id;
  const user = await interaction.guild.members.fetch(interaction.user.id);

  // get all birthdays from strapi's DB
  const publicBirthdays = await axiosInstance
    .get(backUrl + `/birthdays?filters[visibility][$eq]=public`)
    .then((obj) => obj?.data?.data);

  // promise fetch the user by user_id obtained previously
  let birthdayPromises = [];

  if (publicBirthdays && publicBirthdays.length > 0) {
    birthdayPromises = publicBirthdays.map(async (birthday) => {
      const user = await interaction.guild.members.fetch(birthday.user_id);
      return {
        user,
        birthday,
      };
    });
  }
  // promise all the birthdays to get the discord user + birthday strapi object
  const resolvedBirthdays = await Promise.all(birthdayPromises);
  const embedValue = resolvedBirthdays.reduce(
    (acc, birthObj) =>
      `${birthObj.user}: ${birthObj.birthday.birth_date}\n` + acc,
    ""
  );

  // construct the birthday embed
  const birthdayListEmbed = new EmbedBuilder()
    .setTitle("Birthdays")
    .setColor(0x0099ff)

    .setThumbnail(
      "https://img.icons8.com/?size=100&id=123624&format=png&color=000000"
    )
    .addFields(
      {
        name: "\u200b",
        value: `${
          embedValue || "There are no public birthday set in Snowflake"
        }`,
      } // This field will appear empty
    )
    .setTimestamp()
    .setFooter({
      text: "Snowflake",
    });

  await interaction.reply({ embeds: [birthdayListEmbed] });
};
