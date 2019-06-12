"use strict";

const GENERATE_API = "https://avatar.lyrebird.ai/api/v0/generate";
const AUTH_API = "https://myvoice.lyrebird.ai/authorize";

console.log("LOADING LIBRARIES...");

const prefix = "lyre_";

const request = require("request");
const crypto = require("crypto");
const fs = require("fs");

const Discord = require("discord.js");
const client = new Discord.Client();

client.on("ready", function() {
	client.user.setActivity("with your voice").catch(console.error);
	console.log("BOT READY FOR ACTION!");
});

function playUtterance(utterance, token, message) {
	if (utterance) {
		console.log("Playing " + utterance + "!");
		const fileName = crypto.randomBytes(48).toString("hex") + ".wav";
		request.post({
			url: GENERATE_API,
			headers: {
				"Authorization": "Bearer " + token
			},
			json: true,
			body: {
				text: utterance
			}
		}, function(error, response, body) {
			if (error) {
				console.error(error);
				fs.unlinkSync(fileName);
			} else if (response.statusCode !== 200) {
				message.channel.send(body.description).catch(console.error);
				fs.unlinkSync(fileName);
			} else if (message.guild && message.guild.voice && message.guild.voice.connection) {
				message.guild.voice.connection.play(fileName).on("finish", function() {
					fs.unlinkSync(fileName);
				});
			} else {
				message.channel.send({
					files: [{
						attachment: fileName,
						name: utterance.replace(/[^a-z0-9]/gi, "_") + ".wav"
					}]
				}).then(function() {
					fs.unlinkSync(fileName);
				}).catch(console.error);
			}
		}).pipe(fs.createWriteStream(fileName));
	} else {
		message.channel.send("No text specified! Type something to say!").catch(console.error);
	}
}

function connected(db) {
	client.on("message", function(message) {
		if (message.author.bot) return;
		const content = message.content.toLowerCase();
		const guild = (message.guild || message.channel).id;
		if (content === prefix + "addvoice") {
			const secret = crypto.randomBytes(48).toString("hex");
			const rich = new Discord.MessageEmbed();
			rich.setTitle("Add your voice");
			rich.setDescription("[Click here to add your Lyrebird voice](" + AUTH_API + "?response_type=code&client_id=" + process.env.LYRE_CLIENT_ID + "&redirect_uri=" + encodeURIComponent(process.env.LYRE_REDIRECT_URI) + "&scope=voice&state=" + secret + ")");
			rich.setColor(0x1d52d6);
			message.author.send(rich).catch(console.error);
			db.collection("pending").insertOne({
				guild: guild,
				channel: message.channel.id,
				author: message.author.id,
				secret: secret
			});
		} else if (content === prefix + "join") {
			if (message.member.voice && message.member.voice.channel) {
				message.member.voice.channel.join().catch(function() {
					message.channel.send("Missing permission to join voice channels!").catch(console.error);
				});
			} else {
				message.channel.send("Join a voice channel first!").catch(console.error);
			}
		} else if (content === prefix + "leave") {
			const connection = message.guild.voice && message.guild.voice.connection;
			if (connection) {
				connection.disconnect();
			}
		} else if (content.startsWith(prefix + "share")) {
			const command = content.slice((prefix + "share").length).trim();
			if (command) {
				db.collection("voices").updateOne({ author: message.author.id, guild: guild }, { $set: { command: command } }, function(error) {
					if (error) {
						console.error(error);
						message.channel.send("Error adding command!").catch(console.error);
					} else {
						console.log("Added command " + prefix + command + "!");
						message.channel.send("Thanks! Type `" + prefix + command + "` to use this voice!").catch(console.error);
					}
				});
			} else {
				message.channel.send("Type a command! For example, `" + prefix + "share myvoice` will allow others to use your voice with the command `" + prefix + "myvoice`.").catch(console.error);
			}
		} else if (content.startsWith(prefix + "say")) {
			db.collection("voices").findOne({ author: message.author.id, guild: guild }, function(error, result) {
				if (error) {
					console.error(error);
					message.channel.send("Error retrieving voice!").catch(console.error);
				} else if (result) {
					const utterance = message.content.slice((prefix + "say").length).trim();
					playUtterance(utterance, result.token.access_token, message);
				} else {
					message.channel.send("You have no registered voice! Add one with `" + prefix + "addvoice`!").catch(console.error);
				}
			});
		} else if (content.startsWith(prefix)) {
			const command = content.split(" ")[0].slice(prefix.length).trim();
			db.collection("voices").findOne({ guild: guild, command: command }, function(error, result) {
				if (error) {
					console.error(error);
					message.channel.send("Error retrieving voice `" + command + "`!");
				} else if (result) {
					const utterance = message.content.slice((prefix + command).length).trim();
					playUtterance(utterance, result.token.access_token, message);
				}
			});
		}
	});
	client.login(process.env.DISCORD_BOT_TOKEN).catch(console.error);
}

const MongoClient = require("mongodb").MongoClient;
MongoClient.connect(process.env.MONGODB_URI, { useNewUrlParser: true }, function(error, dbClient) {
	if (error) {
		console.error(error);
	} else {
		console.log("CONNECTED TO DATABASE FROM BOT!");
		const db = dbClient.db("lyrebird");
		let changes = db.collection("voices").watch();
		changes.on("change", function(change) {
			if (client && change.operationType === "insert" && change.fullDocument) {
				const channel = client.channels.get(change.fullDocument.channel);
				const author = client.users.get(change.fullDocument.author);
				if (channel && author) {
					channel.send(author.tag + " added their voice! Generate speech with `" + prefix + "say`, or type `" + prefix + "share` to add a command for others in this guild to use your voice!").catch(console.error);
				}
			}
		});
		connected(db);
	}
});