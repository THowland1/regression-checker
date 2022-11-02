import chromium from "chrome-aws-lambda";
import puppeteer from "puppeteer-core";
let savedExecutablePath: string | null = null;
async function getExecutablePath() {
  if (savedExecutablePath) {
    return savedExecutablePath;
  } else {
    const newvalue = await chromium.executablePath;
    savedExecutablePath = newvalue;
    return newvalue;
  }
}

let savedBrowser: puppeteer.Browser | null = null;
async function getBrowser() {
  if (savedBrowser) {
    return savedBrowser;
  } else {
    const executablePath = await getExecutablePath();
    console.log(executablePath);
    const newvalue = await puppeteer.launch(
      Boolean(process.env.DEV)
        ? {
            args: [],
            executablePath:
              "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser",
            headless: true,
          }
        : {
            args: chromium.args,
            executablePath,
            headless: chromium.headless,
          }
    );
    savedBrowser = newvalue;
    return newvalue;
  }
}

export async function screenshot() {
  const browser = await getBrowser();
  const page = await browser.newPage();

  await page.setViewport({ width: 1920, height: 1080 });

  await page.goto("https://heardlify.app", { waitUntil: "networkidle2" });

  const screenshot = await page.screenshot();

  return screenshot;
}
