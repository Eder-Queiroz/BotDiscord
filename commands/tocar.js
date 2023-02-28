const {SlashCommandBuilder, MessageEmbed} = require("discord.js");
const { QueryType } = require("discord-player")

module.exports = {

    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("play a song from YouTube.")
        .addSubcommand(subcommand =>
            subcommand
                .setName("search")
                .setDescription("Searches for a song and plays it")
                .addStringOption(option =>
                    option.setName("searchterms").setDescription("search keywords").setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("playlist")
                .setDescription("Plays a playlist from YT")
                .addStringOption(option => option.setName("url").setDescription("the playlist's url").setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("song")
                .setDescription("Plays a single song from YT")
                .addStringOption(option => option.setName("url").setDescription("the song's url").setRequired(true))
        ),
    
        async execute(interection, client) {
         
            if(!interection.member.voice.channel) {
                return interection.reply("Você precisa estar em um canal de voz para tocar uma musica. Burro!");
            }

            const queue = await client.player.createQueue(interection.guild);

            if(!queue.connection) {
                await queue.connect(interection.member.voice.channel);
            }

        }

}