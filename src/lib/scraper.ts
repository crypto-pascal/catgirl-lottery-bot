import puppeteer, { Browser, Page } from 'puppeteer'

export class Scraper {

    private browser!: Browser
    private page!: Page

    constructor() {
        puppeteer.launch({
            headless: false
        }).then((browser) => {
            this.browser = browser
            browser.newPage()
                .then((page) => {
                    this.page = page
                })
        })
    }


    goToPage(url: string): Promise<void> {
        return new Promise((resolve, reject) => {
            this.page.goto(url, {
                waitUntil: 'networkidle2'
            })
            .then(() => resolve())
            .catch((err) => reject(err))
        })
    }

    getPageContent(): Promise<string> {
        return this.page.content()
    }

    getElement(selector: string): Promise<any> {
        return this.page.$(selector)
    }


}   