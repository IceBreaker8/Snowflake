require("dotenv").config();

const { token } = process.env;
const { Client, GatewayIntentBits, codeBlock } = require("discord.js");
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.on("ready", () => {
  console.log(`Bot is ready as: ${client.user.tag}`);
});

/**
 * currencies convertion
 */
client.on("messageCreate", (message) => {
  // To avoid bot replying to its own messages
  if (message.author.bot) return;

  console.log(`This is ${process.env.NODE_ENV}!`);
  //message.reply(`This is ${process.env.NODE_ENV}!`);
  /*
  const content = message.content;
  console.log(content);
  extractAndReplacePrices(content).then((result) => {
    if (result.matches && result.matches != [] && result.matches.length > 0) {
      message.reply(codeBlock(result.replacedMessage));
    }
  });
  */
  //
});

async function extractAndReplaceDates(message) {
  const regexPattern = /<\d{1,2}:\d{2} [ap]m>/;

  try {
    const regex = new RegExp(regexPattern, "g");
    const matches = [];

    const matchPromises = [];

    let match;
    while ((match = regex.exec(message)) !== null) {
      const [matchedString, price, , currencyCode] = match;
      console.log(match);
      matchPromises.push(
        (async () => {
          try {
            // time conversion
            const date = parseTimeString("05:00 pm");
            const unix = Math.floor(date.getTime() / 1000);
            console.log("+++++++++++++++++++++++++++>", date, " , ", unix);
            matches.push({ time: "asfd" });
            // if the fetch fails, the currency doesn't exist, we return the original message
            return `<t:${unix}:f>`;
          } catch (fetchError) {
            console.error(`No match found for the currency: ${currencyCode}`);
            // if the fetch fails, the currency doesn't exist, we return the original message
            return matchedString;
          }
        })()
      );
    }

    // Wait for all promises to resolve
    const replacements = await Promise.all(matchPromises);

    console.log(replacements);

    // Replace the matches in the original message
    const replacedMessage = message.replace(regex, () => replacements.shift());

    console.log({ matches, replacedMessage });
    return { matches, replacedMessage };
  } catch (error) {
    console.error("Unknown error");
    return { matches: [], replacedMessage: message };
  }
}

/**
 *
 * prices
 */
async function extractAndReplacePrices(message) {
  const regexPattern = /-(\d+(\.\d{1,9999})?)\s(\w+?)-/g;

  try {
    const regex = new RegExp(regexPattern, "g");
    const matches = [];

    const matchPromises = [];

    let match;
    while ((match = regex.exec(message)) !== null) {
      const [matchedString, price, , currencyCode] = match;
      console.log(match);
      matchPromises.push(
        (async () => {
          try {
            const multiplier = await fetchData(currencyCode);
            if (multiplier !== "") {
              resultBeforeRounding = price * multiplier;

              // if the conversion rate is so small, like SHIB, we don't round it ;)
              if (resultBeforeRounding >= 1) {
                resultedConversion =
                  Math.round(resultBeforeRounding * 100) / 100;
              } else {
                resultedConversion = resultBeforeRounding; // Do not round if less than 0
              }

              matches.push({ price, currencyCode });
              return `${resultedConversion}€`;
            }
            // if the fetch fails, the currency doesn't exist, we return the original message
            return matchedString;
          } catch (fetchError) {
            console.error(`No match found for the currency: ${currencyCode}`);
            // if the fetch fails, the currency doesn't exist, we return the original message
            return matchedString;
          }
        })()
      );
    }

    // Wait for all promises to resolve
    const replacements = await Promise.all(matchPromises);

    // Replace the matches in the original message
    const replacedMessage = message.replace(regex, () => replacements.shift());

    console.log({ matches, replacedMessage });
    return { matches, replacedMessage };
  } catch (error) {
    console.error("Unknown error");
    return { matches: [], replacedMessage: message };
  }
}

// fetching currency from CDN link
async function fetchData(currencyCode) {
  return fetch(
    `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@2024.3.2/v1/currencies/${currencyCode
      ?.toString()
      ?.toLowerCase()}.json`
  )
    .then((res) => res.json())
    .then((res) => res[[currencyCode]]["eur"]);
}

function parseTimeString(timeStr) {
  try {
    // Split the time string into hours, minutes, and am/pm
    const [timeDigits, amPm] = timeStr.split(" ");
    const [hours, minutes] = timeDigits.split(":").map(Number);

    // Convert hours to 24-hour format
    let adjustedHours = hours;
    if (amPm.toLowerCase() === "pm" && hours !== 12) {
      adjustedHours += 12;
    } else if (amPm.toLowerCase() === "am" && hours === 12) {
      adjustedHours = 0;
    }

    // Create a new Date object with the current date and parsed time
    const now = new Date();
    const dateObj = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      adjustedHours,
      minutes
    );
    return dateObj;
  } catch (error) {
    console.error("Error parsing time string:", error.message);
    return null;
  }
}

// start discord bot connection
client.login(token);
