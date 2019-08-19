const config = require('./config.json')
const Discord = require('discord.js')
const client = new Discord.Client()


const sentimentScore = 0

client.once('ready', () => {
	console.log('Sentiment Bot has connected!')
})

client.on('message', message => {
	if (message.content.startsWith('!sentiment')) {
		message.channel.send(`Sentiment Level: \`${sentimentScore}\``)
	}
	else if (message.author.id !== client.user.id) {
		message.channel.send(`Message to be analyzed: ${message.content}`)
	}
})

client.login(config.token)