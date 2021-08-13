import { CloudFunctionsContext } from '@google-cloud/functions-framework/build/src/functions';
import { PubsubMessage } from '@google-cloud/pubsub/build/src/publisher';
import { Storage } from '@google-cloud/storage';
import puppeteer from 'puppeteer';

const UriKey = 'uri';
const PrefixKey = 'prefix';
const BucketKey = 'bucket';
const WidthKey = 'width';
const HeightKey = 'height';

const format = (date: Date): string => {
  const yyyy = `${date.getFullYear()}`;
  const MM = ('0' + (date.getMonth() + 1)).slice(-2);
  const dd = ('0' + date.getDate()).slice(-2);
  const hh = ('0' + date.getHours()).slice(-2);
  const mm = ('0' + date.getMinutes()).slice(-2);
  const ss = ('0' + date.getSeconds()).slice(-2);
  return `${yyyy}/${MM}/${dd}-${hh}${mm}${ss}`;
};

const takeScreenshot = async (uri: string, width: number, height: number, log: (msg: string) => void): Promise<Buffer> => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox'],
  });
  const page = await browser.newPage();
  page.setViewport({width, height});
  await page.goto(uri, {
    'waitUntil' : 'networkidle0',
  });
  log('navigated.')
  return (await page.screenshot({type: 'jpeg'}) as Buffer);
}

const save = async (bucket: string, screenshot: Buffer, key: string) => {
  const storage = new Storage();
  await storage.bucket(bucket).file(key).save(screenshot);
}

const main = async (event: PubsubMessage, ctx: CloudFunctionsContext) => {
  const log = (msg: string) => { console.log(ctx.eventId, msg); }
  log('start');
//  if (!event.data) throw 'data is empty';
//  console.log(Buffer.from(event.data as string, 'base64').toString())
  if (!event.attributes || !event.attributes[UriKey] || !event.attributes[PrefixKey] || !event.attributes[BucketKey]) {
    throw `bad attributes ${event.attributes}`;
  }
  const uri = event.attributes[UriKey];
  const prefix = event.attributes[PrefixKey];
  const bucket = event.attributes[BucketKey];
  const width = parseInt(event.attributes[WidthKey] || '1600');
  const height = parseInt(event.attributes[HeightKey] || '1600');
  const screenshot = await takeScreenshot(uri, width, height, log)
  log('captured.');
  const key = `${prefix}${format(new Date)}.jpg`;
  save(bucket, screenshot, key).catch(console.error);
  log('saved.');
}

module.exports = {
 main: main
};
