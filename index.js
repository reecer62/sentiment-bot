const config = require('./config.json')
const nicejob = require('nicejob')
const Sentiment = require('sentiment')
const sentiment = new Sentiment()
const Discord = require('discord.js')
const client = new Discord.Client()

let sumScore = 0
let numMessages = 0
let avgScore = 0
const messageStack = []

client.once('ready', () => {
	console.log('Sentiment Bot has connected!')
})

client.on('message', message => {
	if (message.content.startsWith('!sentiment')) {
		const args = message.content.slice(1).split(/ +/)
		if (args.length > 1 && !isNaN(parseInt(args[1]))) {
			const messageId = parseInt(args[1])
			messageId > messageStack.length ? message.channel.send(`Can't access message ${messageId}`) : message.channel.send(`Score for message ${messageId}: ${messageStack[messageId - 1].score}`)
		}
		else {
			message.channel.send(`Current sentiment level: \`${avgScore}\``)
		}
	}
	else if (message.author.id !== client.user.id) {
		const sentimentScore = sentiment.analyze(message.content).score
		if (messageStack.length === 10) {
			messageStack.pop()
		}
		messageStack.unshift({
			'score': sentimentScore,
			'message': message.content,
		})
		numMessages++
		sumScore += sentimentScore
		avgScore = sumScore / numMessages
		if (sentimentScore >= 0) {
			message.channel.send(nicejob())
		}
		else {
			message.channel.send(nicejob.not())
		}
		// message.channel.send(`Message to be analyzed: ${message.content}\nMessage score: ${sentimentScore}`)
	}
})

client.login(config.token)