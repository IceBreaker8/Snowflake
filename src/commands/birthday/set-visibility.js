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
  // grab interaction variables
  const userId = interaction.user.id;
  const visibility = interaction.options.getString("visibility");

  return await axiosInstance
    .get(backUrl + `/birthdays?filters[user_id][$eq]=${userId}`)
    .then((obj) => obj.data)
    .then((birthdays) => {
      const birthday = birthdays?.data?.[0];
      // check if birthday exists
      if (birthday) {
        return axiosInstance
          .put(backUrl + `/birthdays/${birthday.documentId}`, {
            data: {
              visibility,
            },
          })
          .then(
            (birthday) => {
              return interaction.reply({
                content: `You set your birthday visibility to ${visibility}`,
                ephemeral: true,
              });
            },
            (err) => {
              return interaction.reply({
                content: err?.response?.data?.error?.message,
                ephemeral: true,
              });
            }
          );
      } else {
        return interaction.reply({
          content: "You didn't set a birthday in Snowflake yet",
          ephemeral: true,
        });
      }
    });
};
