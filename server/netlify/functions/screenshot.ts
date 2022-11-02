import { Handler } from "@netlify/functions";
import { screenshot } from "../utils/screenshot";

export const handler: Handler = async (event, { awsRequestId }) => {
  const screen = await screenshot();

  return {
    statusCode: 200,
    headers: {
      "Cache-Control": `public, max-age=${9999999}`,
      "Content-Type": "image/png",
      Expires: new Date(Date.now() + 9999999 * 1000).toUTCString(),
    },
    body: screen!.toString("base64"),
    isBase64Encoded: true,
  };
};
// import { Handler } from "@netlify/functions";
// import chromium from "chrome-aws-lambda";
// import puppeteer from "puppeteer-core";
// let savedExecutablePath: string | null = null;
// async function getExecutablePath() {
//   if (savedExecutablePath) {
//     return savedExecutablePath;
//   } else {
//     const newvalue = await chromium.executablePath;
//     savedExecutablePath = newvalue;
//     return newvalue;
//   }
// }

// let savedBrowser: puppeteer.Browser | null = null;
// async function getBrowser() {
//   if (savedBrowser) {
//     return savedBrowser;
//   } else {
//     const executablePath = await getExecutablePath();
//     console.log(executablePath);
//     const newvalue = await puppeteer.launch(
//       Boolean(process.env.DEV)
//         ? {
//             args: [],
//             executablePath:
//               "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser",
//             headless: true,
//           }
//         : {
//             args: chromium.args,
//             executablePath,
//             headless: chromium.headless,
//           }
//     );
//     savedBrowser = newvalue;
//     return newvalue;
//   }
// }

// export const handler: Handler = async (event, { awsRequestId }) => {
//   const browser = await getBrowser();
//   const page = await browser.newPage();

//   await page.setViewport({ width: 1920, height: 1080 });

//   await page.goto("https://heardlify.app", { waitUntil: "networkidle2" });

//   const screenshot = await page.screenshot();

//   // await browser.close();

//   //   return {
//   //     statusCode: 200,
//   //     body: JSON.stringify({ hello: executablePath }, null, 2),
//   //   };

//   return {
//     statusCode: 200,
//     headers: {
//       "Cache-Control": `public, max-age=${9999999}`,
//       "Content-Type": "image/png",
//       Expires: new Date(Date.now() + 9999999 * 1000).toUTCString(),
//     },
//     body: screenshot.toString("base64"),
//     isBase64Encoded: true,
//   };
// };
