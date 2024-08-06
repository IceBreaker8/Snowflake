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
  const member = await interaction.guild.members.fetch(interaction.user.id);
  if (
    !member.roles.cache.map((role) => role.name).includes("Snowflake Birthday")
  ) {
    return await interaction.reply({
      content:
        "You are not authorized to use the Birthday commands, you need the Snowflake Birthday role, ask admins to assign you this role",
      ephemeral: true,
    });
  }
  const findBirthday = await axiosInstance
    .get(backUrl + `/birthdays?filters[user_id][$eq]=${userId}`)
    .then((obj) => obj.data)
    .then(
      (birthdays) => {
        const birthday = birthdays?.data?.[0];
        // remove birthday if exists
        if (birthday) {
          return axiosInstance
            .delete(backUrl + `/birthdays/${birthday.documentId}`)
            .then(
              (res) => {
                return interaction.reply({
                  content: "Snowflake has successfully removed your birthday",
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
      },
      (err) => {
        return interaction.reply({
          content: err?.response?.data?.error?.message,
          ephemeral: true,
        });
      }
    );
};
