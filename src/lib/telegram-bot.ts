import Api from 'node-telegram-bot-api'

export class TelegramBot {

    private api: Api

    constructor(private apiKey: string) {
        this.api = new Api(
            apiKey,
            {
                polling: true
            }
        )
    }

    sendMessage(chatId: number, message: string) {
        this.api.sendMessage(chatId, message)
    }

}

