const {SlashCommandBuilder} = require('discord.js');

module.exports = {

data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription('return "pong!"'),

async execute(interection) {
    await interection.reply("Pong!");
}

}