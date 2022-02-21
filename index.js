const d = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require('fs');
const client = new d.Client({
  intents: [
    'GUILDS',
    'GUILD_MESSAGES',
    'GUILD_MEMBERS'
  ]
});
client.commands = new d.Collection();
client.data = require('quick.db');

client.on('ready', async () => {
  console.log('bot hazır genjlik!');
});

const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const cmd of commandFiles) {
  const command = require(`./commands/${cmd}`);
  commands.push({
    name: command.name,
    description: command.description,
    options: command.options || [],
    type: 1
  });
  client.commands.set(command.name, command);
}

const token = "bot token", clientId = "bot id", guildId = "sunucu id";
const rest = new REST({ version: '9' }).setToken(token);

(async () => {
	try {
		console.log('Started refreshing application (/) commands.');
		await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands });
		console.log('Successfully reloaded application (/) commands.');
	} catch (error) {
		console.error(error);
	}
})();

client.on('interactionCreate', async (interaction) => {
  const cmdz = client.commands.get(interaction.commandName);
  return cmdz.exe(client, interaction);
});

client.on('guildMemberAdd', async (member) => {
  if (member.guild.id == guildId) {
    function codexs(uzunluk, semboller) {
      var maske = '';
      if (semboller.indexOf('a') > -1) maske += 'abcdefghijklmnopqrstuvwxyz';
      if (semboller.indexOf('A') > -1) maske += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      if (semboller.indexOf('0') > -1) maske += '0123456789';
      var sonuc = '';
      for (var i = uzunluk; i > 0; --i) {
        sonuc += maske[Math.floor(Math.random() * maske.length)];
      }
      return sonuc;
    }
    const codeq = codexs(8, 'A0');
    client.data.set(`code_${member.user.id}`, codeq);
    member.send_code({ m: member, code: codeq });
    member.roles.add("945338614601097316");
  } else { return; }
});

d.User.prototype.verify = async ({ i, codeds, verifiedRoleId, unverifiedRoleId }) => {
  client.data.delete(`code_${i.member.user.id}`);
  i.member.roles.add(verifiedRoleId).catch(() => {});
  i.member.roles.remove(unverifiedRoleId).catch(() => {});
  i.reply({
    embeds: [
      {
        title: "Successfully done!",
        description: ":white_check_mark: You verified yourself, have fun!",
        color: "#2F3136"
      }
    ], ephemeral: true
  });
};

d.GuildMember.prototype.send_code = async ({ m, code }) => {
  m.send({
    embeds: [
      {
        title: `Hey, ${m.user.tag}!`,
        description: `:wave: Thanks for joining our guild! Your verification code: **${code}**`,
        color: "#2F3136"
      }
    ]
  }).catch(async () => {});
};

client.login(token);