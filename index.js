const config = require('./config.json')
const Sentiment = require('sentiment')
const sentiment = new Sentiment()
const Discord = require('discord.js')
const client = new Discord.Client()


let sumScore = 0
let numMessages = 0
let avgScore = 0

client.once('ready', () => {
	console.log('Sentiment Bot has connected!')
})

client.on('message', message => {
	if (message.content.startsWith('!sentiment')) {
		message.channel.send(`Current sentiment level: \`${avgScore}\``)
	}
	else if (message.author.id !== client.user.id) {
		const sentimentScore = sentiment.analyze(message.content).score
		numMessages++
		sumScore += sentimentScore
		avgScore = sumScore / numMessages
		message.channel.send(`Message to be analyzed: ${message.content}\nMessage score: ${sentimentScore}`)
	}
})

client.login(config.token)