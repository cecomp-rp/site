const { Client, GatewayIntentBits } = require("discord.js");

const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
    ],
  });

client.on('ready', () => {
    console.log("I'm in");
    console.log(client.user.username);
});

client.on('message', msg => {
    console.log(msg)
    if (msg.author.id != client.user.id) {
        msg.channel.send(msg.content.split('').reverse().join(''));
    }
});

client.on('error', error => {
    console.error('Error occurred: ', error);
});

client.login(process.env['DISCORD_TOKEN']);