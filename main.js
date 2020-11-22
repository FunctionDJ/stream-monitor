const puppeteer = require("puppeteer-core")
const fs = require("fs").promises
const { width: screenWidth, height: screenHeight } = require("robotjs").getScreenSize()
const availableHeight = screenHeight - 30

const launch = ([w, h], [x, y]) => puppeteer.launch({
  product: "chrome",
  headless: false,
  executablePath: "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  args: [
    "--app=http://0.0.0.0",
    `--window-position=${x},${y}`,
    "--disable-infobars",
    `--window-size=${w},${h}`
  ],
  ignoreDefaultArgs: ["--enable-automation", "--enable-blink-features=IdleDetection"],
  defaultViewport: {
    width: w,
    height: h
  }
})

;(async () => {
  const cookiesString = await fs.readFile("./cookies.json")
  const cookies = JSON.parse(cookiesString)

  launch([screenWidth + 10, availableHeight / 2], [-5, -5]).then(async browser => {
    const pages = await browser.pages()
    await pages[0].setCookie(...cookies)
    pages[0].goto("https://streamlabs.com/dashboard/recent-events")
  })

  launch([screenWidth + 10, availableHeight / 2], [-5, (availableHeight / 2) - 5]).then(async browser => {
    const pages = await browser.pages()
    await pages[0].setCookie(...cookies)
    await pages[0].goto("https://streamlabs.com/widgets/chat-box/v1/653E144A1A9A8853B9BF")
    pages[0].addStyleTag({
      content: "body {background-color: #17242d !important;}"
    })
  })  
})()