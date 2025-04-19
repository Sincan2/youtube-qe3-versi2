import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { faker } from '@faker-js/faker';
import fs from 'fs';
import axios from 'axios';

puppeteer.use(StealthPlugin());

const args = process.argv.slice(2);
const proxy = args[0];
const videoUrl = args[1];

const headersTemplate = () => ({
  'Accept-Language': faker.helpers.arrayElement(['en_US', 'en_GB', 'fr_FR']),
  'User-Agent': faker.internet.userAgent(),
  'X-Forwarded-For': faker.internet.ip(),
  'X-Real-IP': faker.internet.ip(),
  'Referer': faker.internet.url(),
  'Origin': faker.internet.url(),
  'DNT': '1',
  'Connection': 'keep-alive',
  'Cache-Control': 'no-cache',
  'Pragma': 'no-cache'
});

const simulateInteraction = async (page) => {
  try {
    await page.mouse.move(Math.random() * 500, Math.random() * 300);
    await page.keyboard.press('ArrowDown');
    await page.waitForTimeout(1000 + Math.random() * 2000);
  } catch {}
};

const startViewer = async () => {
  let browser;
  try {
    browser = await puppeteer.launch({
      args: [`--proxy-server=socks5://${proxy}`]
    });
    const page = await browser.newPage();
    await page.setExtraHTTPHeaders(headersTemplate());
    await page.goto(videoUrl, { waitUntil: 'domcontentloaded', timeout: 120000 });

    await page.waitForSelector('video', { timeout: 60000 });
    await page.evaluate(() => {
      const video = document.querySelector('video');
      video.play();
      video.playbackRate = 1.25;
    });

    await simulateInteraction(page);
    await page.waitForTimeout(60000 + Math.random() * 30000); // 1–1.5 menit

    console.log(`✅ Finished watching with proxy ${proxy}`);
  } catch (err) {
    console.error(`❌ Viewer error [${proxy}]: ${err.message}`);
  } finally {
    if (browser) await browser.close();
  }
};

startViewer();
