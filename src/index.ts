import { isAfter } from 'date-fns'
import dotenv from 'dotenv'
import { BscScraper } from './lib/bsc-scraper'
import { TelegramBot } from './lib/telegram-bot'
import { formatNumber } from './lib/utils'

dotenv.config()
const telegramApiToken = process.env.TELEGRAM_API_TOKEN
const chatId = Number(process.env.TELEGRAM_CHAT_ID)

const bot = new TelegramBot(telegramApiToken)

const tokenAddress = '0x79ebc9a2ce02277a4b5b3a768b1c0a4ed75bd936'
const devHolder = '0x0000000000000000000000000000000000000001'
const deadHolder = '0xc7e4f8ac1ee96d80a59457d835ce1d3b7ec4e195'

let lastNotifiedDate = new Date()

const scraper: BscScraper = new BscScraper()

const checkLottery = () => {
    scraper.getTransactionsForAddress(tokenAddress, devHolder)
        .then((transactions) => {
            const latestTransaction = transactions.reduce((prev, curr) => isAfter(prev.date, curr.date) ? prev : curr)

            if (isAfter(latestTransaction.date, lastNotifiedDate)) {
                lastNotifiedDate = latestTransaction.date
                if (latestTransaction.to === deadHolder) {
                    const message = `Kitty Lottery Prize Drawn! 🐾\nTotal prize amount of ${formatNumber(latestTransaction.amount)} was added to ${latestTransaction.to} ${latestTransaction.to === deadHolder ? '(Dead Wallet/Burned)' : ''}.\nPlease check https://bscscan.com/tx/${transactions[0].hash}`
                    bot.sendMessage(chatId, message)
                }
            }

        })
}

setInterval(() => {
    checkLottery()
}, 10000)
