const client = global.bot;
const ayar = require("../settings/setting.json");
const { EmbedBuilder, ActivityType } = require("discord.js")
module.exports = async () => {

let guild = client.guilds.cache.get(ayar.GuildID);
await guild.members.fetch();

const { joinVoiceChannel, getVoiceConnection} = require("@discordjs/voice");

const connection = getVoiceConnection(ayar.GuildID);
if (connection) return;
setInterval(async () => {
const VoiceChannel = client.channels.cache.get(ayar.VoiceChannel);
if (VoiceChannel) { joinVoiceChannel({
  channelId: VoiceChannel.id,
  guildId: VoiceChannel.guild.id,
  adapterCreator: VoiceChannel.guild.voiceAdapterCreator,
  selfDeaf: true
})}},
5000);

    let activities = ayar.Durum, i = 0;
    setInterval(() => client.user.setActivity({ name: `${activities[i++ % activities.length]}`,
      type: ActivityType.Streaming,
      url: "https://www.twitch.tv/wetroxead"}), 10000);
 
};

module.exports.conf = {
  name: "ready",
};