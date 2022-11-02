import { Handler } from "@netlify/functions";
import { createClient } from "@supabase/supabase-js";
import { screenshot } from "../utils/screenshot";
import pixelmatch from "pixelmatch";
import imageSize from "image-size";
import { PNG } from "pngjs";

function throwError(message: string): string {
  throw new TypeError(message);
}

const SUPABASE_URL =
  process.env.SUPABASE_URL ?? throwError("SUPABASE_URL is not set");
const SUPABASE_KEY =
  process.env.SUPABASE_KEY ?? throwError("SUPABASE_KEY is not set");

export const handler: Handler = async (event, { awsRequestId }) => {
  // const screen = await screenshot();

  const client = createClient(SUPABASE_URL, SUPABASE_KEY, {});
  const { data: data1, error: error1 } = await client.storage
    .from("regression-checker")
    .download("public/avatar2.png");
  const { data: data2, error: error2 } = await client.storage
    .from("regression-checker")
    .download("public/avatar3.png");

  const buffer1 = Buffer.from(await data1!.arrayBuffer());
  const buffer2 = Buffer.from(await data2!.arrayBuffer());
  const png1 = PNG.sync.read(buffer1);
  const png2 = PNG.sync.read(buffer2);
  const { width, height } = imageSize(buffer1);
  console.log(imageSize(buffer1));
  console.log(imageSize(buffer2));
  const diff = new PNG({ width, height });
  console.log(imageSize(diff.data));
  console.log(imageSize(diff.data));
  //   const { data, error } = await createClient(SUPABASE_URL, SUPABASE_KEY, {})
  //     .storage.from("regression-checker")
  //     .upload("public/avatar2.png", screen, { contentType: "image/png" });
  const comparison = pixelmatch(
    png1.data,
    png2.data,
    diff.data,
    width!,
    height!,
    {
      threshold: 0.05,
    }
  );
  console.log(comparison);
  //   console.log(imageSize(diff.data));
  const doooooo = PNG.sync.write(diff);
  console.log(comparison);
  return {
    statusCode: 200,
    body: doooooo.toString("base64"),
    isBase64Encoded: true,
    headers: {
      "Content-Type": "image/png",
    },
  };
};
