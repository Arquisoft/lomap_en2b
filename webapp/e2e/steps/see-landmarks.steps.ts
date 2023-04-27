import { defineFeature, loadFeature } from 'jest-cucumber';
import puppeteer from "puppeteer";

const feature = loadFeature('../features/see-landmarks.feature');

let page: puppeteer.Page;
let browser: puppeteer.Browser;

defineFeature(feature, test => {
  
  beforeAll(async () => {
    browser = process.env.GITHUB_ACTIONS
      ? await puppeteer.launch()
      : await puppeteer.launch({ headless: false, slowMo: 50 });
    page = await browser.newPage();

    await page
      .goto("http://localhost:3000", {
        waitUntil: "networkidle0",
      })
      .catch(() => {});
  });

  test('The user logs in the site', ({given,when,then}) => {
    
    let email:string;
    let username:string;

    given('A logged user', () => {
      
    });

    when('I click on the see Landmarks tab', async () => {
      await expect(page).toClick('Link', { text: 'Add a landmark' })
    });

    then('I am able to see the page to see other landmarks', async () => {
      await expect(page).toMatch('See friends\' landmarks')
    });
  })

  afterAll(async ()=>{
    browser.close()
  })

});