module.exports = {
  name: "verify",
  description: "You can verify yourself in this server!",
  options: [
    {
      name: "code",
      required: true,
      description: "Write your code!",
      type: 3
    }
  ],
  async exe(client, interaction) {
    const code = interaction.options.getString("code");
    const codezs = client.data.get(`code_${interaction.member.user.id}`);
    if (codezs == code) {
      interaction.user.verify({
        i: interaction,
        code: code,
        verifiedRoleId: "onaylanmış rol id",
        unverifiedRoleId: "onaylanmamış rol id"
      });
    } else {
      interaction.reply({
        embeds: [
          {
            title: "An error occurred!",
            description: ":x: This is not your code or this is invalid code!",
            color: "#2F3136"
          }
        ], ephemeral: true
      });
    }
  }
}
