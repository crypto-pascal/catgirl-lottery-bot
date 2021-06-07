import { parse } from 'date-fns'
import cheerio from 'cheerio'
import { Scraper } from './scraper'

export interface Transaction {
    hash: string
    date: Date
    from: string
    to: string
    amount: number
}

export class BscScraper {

    private baseUrl: string = 'https://bscscan.com'

    private scraper: Scraper

    constructor() {
        this.scraper = new Scraper()
    }

    getTransactionsForAddress(token: string, address: string): Promise<Transaction[]> {
        return new Promise(async (resolve) => {
            const url = `${this.baseUrl}/token/${token}?a=${address}`
            await this.scraper.goToPage(url)
            const iframeHandle = await this.scraper.getElement('iframe#tokentxnsiframe')
            const iframe = await iframeHandle.contentFrame()
            await iframe.waitForSelector('table.table')
            const content = await iframe.content()

            const $ = cheerio.load(content)
            const table = $('table.table')

            const transactions: Transaction[] = []

            const transactionRows = table.find('tbody tr').get()
                    
            transactionRows.forEach((transactionRow) => {
                const columns = $(transactionRow).find('td').get()
                const hash = $(columns[0]).find('.hash-tag').text()
                const date = parse($(columns[1]).find('.showDate>span').text(), 'yyyy-MM-dd HH:mm:ss', new Date())

                const from = $(columns[3]).find('.hash-tag').text()
                const to = $(columns[5]).find('.hash-tag').text()
                const amount = Number($(columns[6]).text().replace(',', ''))

                transactions.push({
                    hash: hash,
                    date: date,
                    from: from,
                    to: to,
                    amount: amount
                })
            })
            return resolve(transactions)
        })
    }
}