import { PNG, PNGOptions } from "pngjs";
import { Blob } from "node:buffer";

export function createPNGBlob(options: PNGOptions) {
  const png = new PNG(options);
  return new Blob([PNG.sync.write(png)]);
}
