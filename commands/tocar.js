const {SlashCommandBuilder, EmbedBuilder} = require("discord.js");
const { QueryType } = require("discord-player")

module.exports = {

    data: new SlashCommandBuilder()
        .setName("tocar")
        .setDescription("Toco uma para vc ;).")
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
                .setName("musiquinha")
                .setDescription("Canto um musiquinha do youtube. :)")
                .addStringOption(option => option.setName("url").setDescription("Coloca a url em mim!").setRequired(true))
        ),
    
        async execute(interection, client) {
         
            if(!interection.member.voice.channel) {
                return interection.reply("Você precisa estar em um canal de voz para tocar uma musica. Burro!");
            }

            const queue = await client.player.createQueue(interection.guild);

            if(!queue.connection) {
                await queue.connect(interection.member.voice.channel);
            }

            let embed = new EmbedBuilder();

            if(interection.options.getSubcommand() === "musiquinha") {

                let url = interection.options.getString("url");
                
                // busca da url usando discord-player
                const result = await client.player.search(url, {
                    requestedBy: interection.user,
                    searchEngine: QueryType.YOUTUBE_VIDEO
                });

                // caso não encontre nada na busca, retornar uma mensagem ao usuario.
                if(result.tracks.length === 0) {
                    return interection.reply("Sem musiquinha. Você pesquisou errado, burrão!");
                }

                // adicionando track na fila
                const song = result.tracks[0];

                await queue.addTrack(song);
                embed.setDescription(`**[${song.title}](${song.url})** foi adicionada a fila`)
                .setThumbnail(song.thumbnail)
                .setFooter({text: `Duration: ${song.duration}`})

            } else if(interection.options.getSubcommand() === "playlist") {
                
                // busca pela playlist usando o discord-player
                let url = interection.options.getString("url");
                const result = await client.player.search(url, {
                    requestedBy: interection.user,
                    searchEngine: QueryType.YOUTUBE_PLAYLIST
                });

                if(result.tracks.length === 0) {
                    return interection.reply("Sem playlist. É uma anta!\n Ainda consegue pesquisar errado.");
                }

                const playlist = result.playlist;

                await queue.addTracks(result.tracks);

                // embed
                // .setDescription(`**${result.tracks.length} songs from [${playlist.title}](${playlist.url})** foi adicionada a fila`)
                // .setThumbnail(playlist.thumbnail);
            }

            if(!queue.playing) {
                await queue.play();
            }

            await interection.reply({embeds: [embed]});

        }

}