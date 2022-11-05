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

type ScreenshotProps = {
  viewport: puppeteer.Viewport;
  url: string;
  waitFor: puppeteer.WaitForOptions;
};

export async function screenshot(props: ScreenshotProps) {
  const browser = await getBrowser();
  const page = await browser.newPage();

  await page.setViewport(props.viewport);

  await page.goto(props.url, props.waitFor);

  const screenshot = await page.screenshot();

  return screenshot;
}
