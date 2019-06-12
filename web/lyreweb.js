"use strict";

require("dotenv").config(); // only for local stuff

const TOKEN_API = "https://avatar.lyrebird.ai/api/v0/token";

const logger = require("heroku-logger");

logger.info("LOADING LIBRARIES...");

const prefix = "lyre_";

const request = require("request");
const path = require("path");

const express = require("express");
const app = express();

app.use(express.static(path.join(__dirname)));

function connected(db) {
	app.get("/", function(req, res) {
		if (req.query) {
			if (req.query.code && req.query.state) {
				request.post({
					url: TOKEN_API,
					json: true,
					body: {
						"grant_type": "authorization_code",
						"code": req.query.code,
						"client_id": process.env.LYRE_CLIENT_ID,
						"client_secret": process.env.LYRE_CLIENT_SECRET
					}
				}, function(error, response, body) {
					if (error) {
						res.send("Error requesting token!");
						logger.error(error);
					} else {
						db.collection("pending").findOneAndDelete({ secret: req.query.state }, function(err, result) {
							if (err) {
								res.send("Error retrieving authentication! Try running <code>" + prefix + "addvoice</code> again.");
								logger.error(err);
							} else if (result) {
								db.collection("voices").insertOne({
									guild: result.value.guild,
									channel: result.value.channel,
									author: result.value.author,
									token: body
								}, function(er, info) {
									if (er) {
										res.send("Error adding voice!");
										logger.error(er);
									} else {
										res.send("Thanks! Your voice can be used with <code>" + prefix + "say</code>!");
										logger.debug(JSON.stringify(info));
									}
								});
							} else {
								res.send("Authentication expired. Try running <code>" + prefix + "addvoice</code> again.");
							}
						});
					}
				});
			} else if (req.query.code) {
				res.send("Query parameter <code>state</code> is required!");
			} else if (req.query.state) {
				res.send("Query parameter <code>code</code> is required!");
			} else {
				res.send("Query parameters <code>code</code> and <code>state</code> are required!");
			}
		} else {
			res.send("Query parameters <code>code</code> and <code>state</code> are required!");
		}
	});
	app.listen(process.env.PORT || 4000, function() {
		logger.info("WEBSITE READY FOR ACTION!");
	});
}

const MongoClient = require("mongodb").MongoClient;
MongoClient.connect(process.env.MONGODB_URI, { useNewUrlParser: true }, function(error, dbClient) {
	if (error) {
		logger.error(error);
	} else {
		logger.info("CONNECTED TO DATABASE FROM WEBSITE!");
		const db = dbClient.db("lyrebird");
		connected(db);
	}
});