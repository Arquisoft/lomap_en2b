import { defineFeature, loadFeature } from 'jest-cucumber';
import puppeteer from "puppeteer";

const feature = loadFeature('../features/add-landmarks.feature');

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

    when('I click on the addLandmark tab', async () => {
      await expect(page).toClick('Link', { text: 'Add a landmark' })
    });

    then('I am able to see my information', async () => {
      await expect(page).toMatch('Name of the landmark')
      await expect(page).toMatch('Category of the landmark')
      await expect(page).toMatch('Latitude:')
      await expect(page).toMatch('Longitude:')
    });
  })

  afterAll(async ()=>{
    browser.close()
  })

});