const { Client, Collection, GatewayIntentBits, Partials, InteractionType } = require("discord.js");
const client = global.bot = new Client({ fetchAllMembers: true, intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildEmojisAndStickers, GatewayIntentBits.GuildIntegrations, GatewayIntentBits.GuildWebhooks, GatewayIntentBits.GuildInvites, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildPresences, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildMessageTyping, GatewayIntentBits.DirectMessages, GatewayIntentBits.DirectMessageReactions, GatewayIntentBits.DirectMessageTyping, GatewayIntentBits.MessageContent], shards: "auto", partials: [Partials.Message, Partials.Channel, Partials.GuildMember, Partials.Reaction, Partials.GuildScheduledEvent, Partials.User, Partials.ThreadMember]});
const setting = require("./src/settings/setting.json");
const fs = require("fs");

client.commands = new Collection();
client.aliases = new Collection();
client.cooldown = new Map();

fs.readdir('./src/commands/', (err, files) => {
  if (err) console.error(err);
  console.log(`[Commands] ${files.length} komut yüklenecek.`);
  files.forEach(f => {
    fs.readdir("./src/commands/" + f, (err2, files2) => {
      files2.forEach(file => {
        let props = require(`./src/commands/${f}/` + file);
        console.log(`[Commands] ${props.conf.name} komutu yüklendi!`);
        client.commands.set(props.conf.name, props);
        props.conf.aliases.forEach(alias => {
          client.aliases.set(alias, props.conf.name);
        });
      })
    })
    console.log(`[Commands] ${files.length} komut yüklenecek.`);
  });
});
require("./src/handlers/eventHandler.js");
require("./src/handlers/mongoHandler.js");
require("./src/handlers/functionHandler.js")(client);

client
  .login(process.env.token || setting.token)
  .then(() => console.log("Bot Başarıyla Aktif Oldu!"))
  .catch(() => console.log("[HATA] Bağlanamadım awk git düzelt!"));

  process.on("uncaughtException", err => {
    const errorMsg = err.stack.replace(new RegExp(`${__dirname}/`, "g"), "./");
    console.error("Beklenmedik yakalanamayan hata: ", errorMsg);
  });
  
  process.on("unhandledRejection", err => {
    console.error("Promise Hatası: ", err);
  });


  ///// slash commands
  const { REST } = require('@discordjs/rest');
  const { Routes } = require('discord-api-types/v10');  
  client.slashcommands = new Collection();
  var slashcommands = [];
  
  fs.readdirSync('./src/slashcommands/').forEach(async category => {
		const commands = fs.readdirSync(`./src/slashcommands/${category}/`).filter(cmd => cmd.endsWith('.js'));
		for (const command of commands) {
		const Command = require(`./src/slashcommands/${category}/${command}`);
    client.slashcommands.set(Command.data.name, Command);
    slashcommands.push(Command.data.toJSON());
		}
	});
  
	const rest = new REST({ version: '10' }).setToken(process.env.token || setting.token);
  (async () => {
	try {
		console.log('[Wetrox] Slash komutlar yükleniyor.');
		await rest.put(
			Routes.applicationGuildCommands(setting.ClientID, setting.GuildID),
			{ body: slashcommands },
		).then(() => {
			console.log('[Slash] Slash komutlar yüklendi.');
		});
	}
	catch (e) {
		console.error(e);
	}
})();

client.on('interactionCreate', (interaction) => {
if (interaction.type == InteractionType.ApplicationCommand) {
if(interaction.user.bot) return;
try {
const command = client.slashcommands.get(interaction.commandName)
command.execute(interaction, client)
if (!command) return interaction.reply({ content: 'Bu komut kullanılamıyor.', ephemeral: true }) && client.slashcommands.delete(interaction.commandName);
} catch {
interaction.reply({content: "Komut çalıştırılırken bir sorunla karşılaşıldı! Lütfen tekrar deneyin.", ephemeral: true})
}}
});

client.login(process.env.token || setting.token)