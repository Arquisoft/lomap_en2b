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
    
    given("The user logs in", async () => {
      await expect(page).toClick("button", {text:"Login"});
      
      await page.waitForNavigation(); // wait for the login page to load

      await page.type('#username', "ArqSoftLoMapEn2b")
      await page.type('#password', "#HappySW123")

      await page.click('#login')

      await page.waitForNavigation(); // wait for the redirect
      // await page.waitForTimeout(30000); // wait for 25 seconds (load locations??)
      await page.waitForTimeout(8000);

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