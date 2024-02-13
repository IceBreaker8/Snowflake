require("dotenv").config();

const { token } = process.env;
const { Client, GatewayIntentBits } = require("discord.js");
const client = new Client({
  intents: ["Guilds", "GuildMessages", "MessageContent"],
});

client.on("ready", () => {
  console.log(`Bot is ready as: ${client.user.tag}`);
});

client.on("messageCreate", (message) => {
  // To avoid bot replying to its own messages
  if (message.author.bot) return;
  const content = message.content;
  extractAndReplacePrices(content).then((result) => {
    if (result.matches && result.matches != [] && result.matches.length > 0) {
      message.reply(result.replacedMessage);
    }
  });
});

async function extractAndReplacePrices(message) {
  const regexPattern = /-(\d+(\.\d{1,9999})?)\s(\w+?)-/g;

  try {
    const regex = new RegExp(regexPattern, "g");
    const matches = [];

    const matchPromises = [];

    let match;
    while ((match = regex.exec(message)) !== null) {
      const [matchedString, price, , currencyCode] = match;
      // console.log(match);
      matchPromises.push(
        (async () => {
          try {
            const fetchedData = await fetchData(currencyCode);

            if (fetchedData !== "") {
              const multiplier = fetchedData.eur;
              resultBeforeRounding = price * multiplier;

              console.log(resultBeforeRounding);
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

// fetching currency from CDN link
async function fetchData(currencyCode) {
  return fetch(
    `https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/${currencyCode
      ?.toString()
      ?.toLowerCase()}/eur.json`
  ).then((res) => res.json());
}

// start discord bot connection
client.login(token);
