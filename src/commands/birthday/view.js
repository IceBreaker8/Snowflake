const axios = require("axios");
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

  return await axiosInstance
    .get(backUrl + `/birthdays?filters[user_id][$eq]=${userId}`)
    .then((obj) => obj.data)
    .then((birthdays) => {
      const birthday = birthdays?.data?.[0];
      // show birthday if exists
      if (birthday) {
        // show birthday
        return interaction.reply({
          content: `Your birthday is set on ${birthday.birth_date}`,
          ephemeral: true,
        });
      } else {
        // birthday doesn't exist
        return interaction.reply({
          content: "You didn't set a birthday in Snowflake yet",
          ephemeral: true,
        });
      }
    });
};
