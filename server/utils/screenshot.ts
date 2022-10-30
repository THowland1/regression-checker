import puppeteer from "puppeteer";
export async function screenshot() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("https://heardlify.app");
  const ddd = await page.screenshot();
  return ddd;
}
