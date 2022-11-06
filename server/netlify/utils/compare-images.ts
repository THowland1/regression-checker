import pixelmatch from "pixelmatch";
import imageSize from "image-size";
import { PNG } from "pngjs";
import { Blob } from "node:buffer";

async function asBuffer(data: ImageData) {
  if (data instanceof Buffer) {
    return data;
  }
  return Buffer.from(await data!.arrayBuffer());
}

type ImageData = Blob | Buffer;

export async function compareImages(image1: ImageData, image2: ImageData) {
  const buffer1 = await asBuffer(image1);
  const buffer2 = await asBuffer(image2);
  const png1 = PNG.sync.read(buffer1);
  const png2 = PNG.sync.read(buffer2);
  const { width, height } = imageSize(buffer1);
  const diff = new PNG({ width, height });
  const comparison = pixelmatch(
    png1.data,
    png2.data,
    diff.data,
    width!,
    height!,
    {
      threshold: 0.1,
    }
  );

  return {
    diff: PNG.sync.write(diff),
    pixeldifference: comparison,
  };
}
