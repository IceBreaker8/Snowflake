module.exports = async (client) => {
  client.loadSubcommands = async function (client, interaction, args) {
    try {
      return require(`${process.cwd()}/src/commands/${
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

  const isLeapYear = (year) =>
    (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;

  const getDaysInMonth = (month, year) => {
    const daysInMonth = [
      31,
      28 + (isLeapYear(year) ? 1 : 0),
      31,
      30,
      31,
      30,
      31,
      31,
      30,
      31,
      30,
      31,
    ];
    return daysInMonth[month - 1];
  };

  client.validateDate = (day, month, year) => {
    const dayNum = parseInt(day, 10);
    const monthNum = parseInt(month, 10);
    const yearNum = parseInt(year, 10);

    return (
      !isNaN(dayNum) &&
      !isNaN(monthNum) &&
      !isNaN(yearNum) &&
      monthNum >= 1 &&
      monthNum <= 12 &&
      dayNum >= 1 &&
      dayNum <= getDaysInMonth(monthNum, yearNum)
    );
  };
};
