// Require the necessary discord.js classes
const { Client, Events, GatewayIntentBits, Collection } = require('discord.js');
const { Player } = require("discord-player");

// dotenv
const dotenv = require('dotenv');
dotenv.config();
const {TOKEN} = process.env;

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildVoiceStates] });

//required modules
const fs = require('fs');
const path = require('path');
const commandsPath = path.join(__dirname, "commands");
const commandsFile = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));    

// Create a new collection in client
client.commands = new Collection();

// import commands
for (const file of commandsFile) {

    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    
    if("data" in command && "execute" in command) {
        client.commands.set(command.data.name, command);
    }else {
        console.error(`Esse comando em ${filePath}, esta com data ou execute ausentes`);
    }

}

client.player = new Player(client, {
    ytdlOptions: {
        quality: "highestaudio",
        highWaterMark: 1 << 25
    }
})

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, c => {
	console.log(`Pronto! logado com ${c.user.tag}`);
});

// Log in to Discord with your client's token
client.login(TOKEN);

// Listenner interection of bot
client.on(Events.InteractionCreate, async interection => {
    if(!interection.isChatInputCommand()) return;
    
    const command = interection.client.commands.get(interection.commandName);

    if(!command) {
        console.error('Comando não encontrado');
        return;
    }

    try {
        await command.execute(interection, client);
    } catch (error) {
        console.error(error);
        await interection.reply("Houve um erro ao executar o comando!");
    }
});