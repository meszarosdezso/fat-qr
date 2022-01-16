import { chromium, Page } from 'playwright-chromium'
import { v4 } from 'uuid'
import { performance } from 'perf_hooks'

const BASE_URL = 'https://www.qrcode-monkey.com/'

const selectors = {
  content: '#qrcodeText',
  foreground: "color-picker[ng-model='qrcode.config.bodyColor'] input",
  background: "color-picker[ng-model='qrcode.config.bgColor'] input",
  sprite: 'i.sprite.sprite-body.sprite-dot',
  frame: 'i.sprite.sprite-frame13',
  ball: 'i.sprite.sprite-ball14',
  image: 'img.card-img-top',
}

async function setup() {
  console.info('Setting up page...')
  const browser = await chromium.launch({ timeout: 5000 })
  const page = await browser.newPage({ baseURL: BASE_URL })
  await page.goto('#text')
  await page.waitForLoadState('domcontentloaded')
  await page.waitForLoadState('load')

  await page.click("h3.title:has-text('SET COLORS')")
  const foregroundInput = page.locator(selectors.foreground)
  await foregroundInput.fill('#F47820')
  const backgroundInput = page.locator(selectors.background)
  await backgroundInput.fill('#FCF1E7')

  await page.click("h3.title:has-text('CUSTOMIZE DESIGN')")
  await page.waitForTimeout(250)
  await page.click(selectors.sprite, { force: true })
  await page.click(selectors.frame, { force: true })
  await page.click(selectors.ball, { force: true })

  return page
}

async function createQr(page: Page, data: string) {
  console.info(`Creating QR for ${data}`)

  await page.click("h3.title:has-text('ENTER CONTENT')")
  const contentInput = page.locator(selectors.content)
  await contentInput.focus()
  await contentInput.fill('')
  await page.keyboard.type(data)

  await page.click("button:has-text('Create QR Code')")
  await page.waitForTimeout(1000)

  const image = page.locator(selectors.image)
  await image.screenshot({ path: `codes/${data}.png` })
}

const COUNT = parseInt(process.argv[2] || '1')

const start = performance.now()

setup().then(async (page) => {
  const uuids = Array(COUNT)
    .fill(0)
    .map((_) => v4())

  for await (const id of uuids) {
    await createQr(page, id)
  }

  const time = Math.round(performance.now() - start) / 1000
  const unit = `code${COUNT > 1 ? 's' : ''}`

  console.log(`\n✔ Created ${COUNT} QR ${unit} in ${time} seconds`)
  process.exit(0)
})
