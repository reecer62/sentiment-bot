const config = require('./config.json')
const nicejob = require('nicejob')
const insults = require('insults')
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
		const msgSentiment = sentiment.analyze(message.content)
		// console.log(msgSentiment)
		if (messageStack.length === 10) {
			messageStack.pop()
		}
		messageStack.unshift({
			'score': msgSentiment.score,
			'message': message.content,
		})
		numMessages++
		sumScore += msgSentiment.score
		avgScore = sumScore / numMessages
		if (msgSentiment.score >= 5) {
			let words = getRandomWord(msgSentiment.positive, 3)
			if (words.length === 1) {
				words = words[0]
			}
			else {
				words = words.join(', ')
			}
			message.reply(`*${nicejob().toLowerCase()}* person, thank for spreading such *${nicejob().toLowerCase()}* words like \`${words}\``)
		}
		else if (msgSentiment.score <= -10 || (isBotMentioned(message) && msgSentiment.score < 0)) {
			let words = getRandomWord(msgSentiment.negative, 3)
			if (words.length === 1) {
				words = words[0]
			}
			else {
				words = words.join(', ')
			}
			const insult = insults.default().toLowerCase().slice(0, -1)
			message.reply(`you *${nicejob.not().toLowerCase()}* person, *${insult}* for spreading such ${nicejob.not().toLowerCase()} words like \`${words}\``)
		}
		// message.channel.send(`Message to be analyzed: ${message.content}\nMessage score: ${sentimentScore}`)
	}
})

const getRandomWord = (wordList, maxWords) => {
	const words = []
	for (let i = 0; i < maxWords + 1 && i < wordList.length; i++) {
		const randomWord = getRandomInt(wordList.length - 1)
		words.push(wordList[randomWord])
		wordList.splice(randomWord, 1)
	}
	return words
}

const getRandomInt = max => {
	return Math.floor(Math.random() * Math.floor(max))
}

const isBotMentioned = (message) => {
	const mentionedUsers = message.mentions.users
	let isMentioned = false
	mentionedUsers.forEach(user => {
		if (user.id === client.user.id) {
			isMentioned = true
		}
	})
	return isMentioned
}

client.login(config.token)