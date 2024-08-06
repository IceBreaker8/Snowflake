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
  // command options
  const day = interaction.options.getString("day");
  const month = interaction.options.getString("month");
  const year = interaction.options.getString("year");

  // date validation
  if (!client.validateDate(day, month, year || "2024")) {
    // 2024 for leap years, so the users can input their dates as dd-MM without a year
    return await interaction.reply({
      content: "The date is not valid",
      ephemeral: true,
    });
  }

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

  // check if user has already added their birthday
  const doesBirthdayExist = await axiosInstance
    .get(backUrl + `/birthdays?filters[user_id][$eq]=${userId}`)
    .then((object) => object.data)
    .then(
      (birthdays) => {
        if (birthdays?.data?.length > 0) return true;
        return false;
      },
      (err) => {
        return interaction.reply({
          content: err?.response?.data?.error?.message,
          ephemeral: true,
        });
      }
    );

  if (doesBirthdayExist) {
    return await interaction.reply({
      content: "You have already added your birthday!",
      ephemeral: true,
    });
  }

  /**
   * adding birthday date
   */

  return await axiosInstance
    .post(backUrl + `/birthdays?filters[user_id][$eq]=${userId}`, {
      data: {
        user_id: userId,
        birth_date: `${day}-${month}${year ? `-${year}` : ""}`,
      },
    })
    .then((object) => object.data)
    .then(
      (birthday) => {
        return interaction.reply({
          content:
            "Your birthday has been added, check it using /birthday check",
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
};
