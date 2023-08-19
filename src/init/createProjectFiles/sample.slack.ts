export default `
/**
 * A class representing a Slack bot that can be used to log events to a specified Slack channel.
 */
export default class Slack {
    botToken: string
    channel: string
    onlyAllowErrors: boolean

    /**
     * Creates a new Slack bot.
     * @param {string} [botToken] - The bot token to use for authentication.
     * @param {string} [channel] - The Slack channel to log events to.
     * @param {boolean} [onlyAllowErrors] - If set to true only the error will be logged to Slack
     */
    constructor(botToken: string, channel: string, onlyAllowErrors: boolean = true) {
        this.botToken = botToken;
        this.channel = channel;
        this.onlyAllowErrors = onlyAllowErrors;
    }

    /**
     * Sends a log message to the specified Slack channel.
     * @param {any} e - The event to log.
     * @return {Promise} - A promise that resolves to the result of the fetch call.
     * @private
     */
    async _log(e: any): Promise<any> {
        try {
            if (!this.botToken || !this.channel) return;
            return await fetch("https://slack.com/api/chat.postMessage", {
                method: 'POST',
                headers: {
                    Authorization: ${"`Bearer ${ this.botToken }`"},
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    channel: this.channel,
                    pretty: 1,
                    text: '${"```"}' + JSON.stringify(e, null, 2) + '${"```"}'
                })
            });
        } catch (e) {
            console.error(e);
        }
    }

    /**
     * Logs a message to the specified Slack channel.
     * @param {any} e - The event to log.
     */
    async log(e: any): Promise<void> {
        if (this.onlyAllowErrors) return;
        const event = {
            timestamp: new Date().toString(),
            type: 'LOG',
            event: e
        };
        await this._log(event).catch(e => console.log(e));
    }

    /**
     * Logs an error message to the specified Slack channel.
     * @param {any} e - The event to log.
     */
    async error(e: any): Promise<void> {
        const event = {
            timestamp: new Date().toString(),
            type: 'ERROR',
            event: e
        };
        await this._log(event).catch(e => console.log(e));
    }
}`