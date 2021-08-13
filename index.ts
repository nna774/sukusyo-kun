import { Context } from '@google-cloud/functions-framework/build/src/functions';
import { PubsubMessage } from '@google-cloud/pubsub/build/src/publisher';
import { Storage } from '@google-cloud/storage';
import puppeteer from 'puppeteer';

const BUCKET = 'sukusyo-kun';

const UriKey = 'uri';
const PrefixKey = 'prefix';
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

const takeScreenshot = async (uri: string, width: number, height: number): Promise<Buffer> => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox'],
  });
  const page = await browser.newPage();
  page.setViewport({width, height});
  await page.goto(uri, {
    'waitUntil' : 'networkidle0',
  });
  console.log('navigated.')
  return (await page.screenshot({type: 'jpeg'}) as Buffer);
}

const save = async (screenshot: Buffer, key: string) => {
  const storage = new Storage();
  await storage.bucket(BUCKET).file(key).save(screenshot);
}

const main = async (event: PubsubMessage, ctx: Context) => {
  console.log('start')
//  if (!event.data) throw 'data is empty';
//  console.log(Buffer.from(event.data as string, 'base64').toString())
  if (!event.attributes || event.attributes[UriKey] === '' || event.attributes[PrefixKey] === '' ) {
    throw `bad attributes ${event.attributes}`;
  }
  const uri = event.attributes[UriKey];
  const prefix = event.attributes[PrefixKey];
  const width = parseInt(event.attributes[WidthKey] || '1600');
  const height = parseInt(event.attributes[HeightKey] || '1600');
  const screenshot = await takeScreenshot(uri, width, height)
  console.log('captured.')
  const key = `${prefix}${format(new Date)}.jpg`;
  save(screenshot, key).catch(console.error);
  console.log('saved.')
}

module.exports = {
 main: main
};
