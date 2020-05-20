# THE LYREBIRD API IS NOW DEPRECATED :(
Text to speech Discord bot which used the deprecated [Lyrebird API](https://docs.lyrebird.ai).

This bot was designed to work with [Heroku](https://www.heroku.com), with separate [web](https://github.com/MysteryPancake/Discord-Lyrebird/tree/master/web) and [worker](https://github.com/MysteryPancake/Discord-Lyrebird/tree/master/worker) applications to prevent the bot from going offline. This functionality required a [MongoDB database](https://www.mongodb.com) to store authorized voices and communicate between the applications.

Alternatively, the [combined version of this bot](https://github.com/MysteryPancake/Discord-Lyrebird/tree/master/combined) did not require setting up a database, but could only be run on a server with persistent storage. [Heroku's storage is cleared every time the application is restarted](https://devcenter.heroku.com/articles/active-storage-on-heroku). I never finished the combined version, so it is missing some features present in the separated version.

## Commands
### Add Voice
`lyre_addvoice`

*Registers your voice to be used with `lyre_say` and `lyre_share`.*

*Your voice can only be used on the guild this command was run on.*

### Say
`lyre_say`

*Generates speech using your voice, registered with `lyre_addvoice`.*

*If the bot is in a voice channel, the speech will play through this channel.*

*If not, the speech will be sent as an attachment.*

### Share
`lyre_share`

*Creates a command through which others in your guild can generate speech using your voice.*

*This command will function identically to `lyre_say`, except others in your guild can use it.*

### Join
`lyre_join`

*Joins the voice channel you are currently in.*

### Leave
`lyre_leave`

*Leaves the voice channel.*

### Say Token
`lyre_saytoken`

*Generates speech using a Lyrebird token provided directly.*

*This command does not require a database, but is not recommended as others can see your token.*

## Setup
1. [Create your voice](https://myvoice.lyrebird.ai).

2. Set the environment variable `LYRE_REDIRECT_URI` to your computer's address. Locally, this will be `http://localhost:8080`. This is used for authorization.

3. [Create your Lyrebird app](https://myvoice.lyrebird.ai/application/new). Make sure `Redirect URI` matches `LYRE_REDIRECT_URI`.

4. Set the environment variables `LYRE_CLIENT_ID` and `LYRE_CLIENT_SECRET` from the website.

5. [Create your Discord app with a Bot](https://discordapp.com/developers/applications/me).

6. Set the environment variable `DISCORD_BOT_TOKEN` from the website.

7. Go to `https://discordapp.com/oauth2/authorize?client_id=<CLIENT_ID>&scope=bot`, with `<CLIENT_ID>` as your Discord app's client ID.

8. [Install Node.js](https://nodejs.org/en/download): `brew install node`

9. [Install FFmpeg](https://www.ffmpeg.org/download.html): `brew install ffmpeg`

10. Install the dependencies: `npm install`

11. [Run the bot](https://github.com/MysteryPancake/Discord-Lyrebird/blob/master/combined/lyrebird.js): `npm start`

12. Hope it works!

![Icon](lyrebird.png?raw=true)
