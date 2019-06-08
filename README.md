# Discord Lyrebird
Text to speech Discord bot using the [Lyrebird API](https://docs.lyrebird.ai).

## Commands
### Add Voice
`lyre_addvoice`

*Registers your voice to be used with `lyre_voice<INDEX>`.*

*Your voice can only be used on the server the command was run on.*

### Join
`lyre_join`

*Joins the voice channel you are currently in.*

### Leave
`lyre_leave`

*Leaves the voice channel.*

### Generate Voice
`lyre_voice<INDEX>`

*Generates speech using a voice registered with `lyre_addvoice`.*

*If the bot is in a voice channel, the speech will play through the channel.*

*If not, the speech will be sent as an attachment.*

#### Example
`lyre_voice1 Hello!`

## Setup
1. [Create your voice](https://myvoice.lyrebird.ai).

2. Set the environment variable `LYRE_REDIRECT_URI` to your computer's address. Locally, this will be `http://localhost:4000`. This is used for authorization.

3. [Create your Lyrebird app](https://myvoice.lyrebird.ai/application/new). Make sure `Redirect URI` matches `LYRE_REDIRECT_URI`.

4. Set the environment variables `LYRE_CLIENT_ID` and `LYRE_CLIENT_SECRET` from the website.

5. [Create your Discord app with a Bot](https://discordapp.com/developers/applications/me).

6. Set the environment variable `DISCORD_BOT_TOKEN` from the website.

7. To add your bot, go to `https://discordapp.com/oauth2/authorize?client_id=<CLIENT_ID>&scope=bot`, with `<CLIENT_ID>` as your Discord app's client ID.

8. [Install Node.js](https://nodejs.org/en/download): `brew install node`

9. [Install FFmpeg](https://www.ffmpeg.org/download.html): `brew install ffmpeg`

10. [Install the dependencies](https://github.com/MysteryPancake/Discord-Lyrebird/blob/master/package.json#L35-L41): `npm install`

11. [Run the bot](https://github.com/MysteryPancake/Discord-Lyrebird/blob/master/lyrebird.js): `npm start`

12. Hope it works!

![Icon](lyrebird.png?raw=true)
