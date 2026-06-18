import { readFileSync } from "fs";

const path = process.argv[2];
const data = readFileSync(path);
let w = 0;
let h = 0;
let idx = 0;
while (true) {
  const i = data.indexOf(Buffer.from("tkhd"), idx);
  if (i < 4) break;
  const start = i - 4;
  const ver = data[start + 8];
  if (ver === 0) {
    w = data.readUInt32BE(start + 84) >> 16;
    h = data.readUInt32BE(start + 88) >> 16;
  } else if (ver === 1) {
    w = data.readUInt32BE(start + 96) >> 16;
    h = data.readUInt32BE(start + 100) >> 16;
  }
  if (w && h) break;
  idx = i + 4;
}
console.log(JSON.stringify({ width: w, height: h, bytes: data.length }));
