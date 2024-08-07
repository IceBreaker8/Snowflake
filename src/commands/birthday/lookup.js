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
  const fetchedUser = interaction.options.getUser("user");
  console.log(fetchedUser);

  // get all birthdays from strapi's DB
  const fetchedBirthday = await axiosInstance
    .get(backUrl + `/birthdays?filters[user_id][$eq]=${fetchedUser.id}`)
    .then((obj) => obj?.data?.data?.[0]);

  if (!fetchedBirthday) {
    return interaction.reply({
      content: "This user hasn't set a birthday yet",
      ephemeral: true,
    });
  }

  if (!fetchedBirthday.visibility || fetchedBirthday.visibility == "private") {
    return interaction.reply({
      content: "This user has set their birthday to Private",
      ephemeral: true,
    });
  }

  // construct the birthday embed
  const birthdayListEmbed = new EmbedBuilder()
    .setTitle("Birthday")
    .setColor(0x0099ff)

    .setThumbnail(fetchedUser.displayAvatarURL({ dynamic: true, size: 1024 }))

    .addFields(
      {
        name: "\u200b",
        value: `${fetchedUser}: ${fetchedBirthday.birth_date}`,
      } // This field will appear empty
    )
    .setTimestamp()
    .setFooter({
      text: "Snowflake",
    });

  await interaction.reply({ embeds: [birthdayListEmbed], ephemeral: true });
};
