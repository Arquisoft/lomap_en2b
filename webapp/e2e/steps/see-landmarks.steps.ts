import { defineFeature, loadFeature } from 'jest-cucumber';
import puppeteer from "puppeteer";

const feature = loadFeature('./features/see-landmarks.feature');

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

  test('Seeing landmarks', ({given,when,then}) => {
    given("The user logs in", async () => {
      console.log("The user logs in");
      await expect(page).toClick("button", {text:"Login"});
      
      await page.waitForNavigation(); // wait for the login page to load

      await page.type('#username', "ArqSoftLoMapEn2b")
      await page.type('#password', "#HappySW123")

      await page.click('#login')

      await page.waitForNavigation(); // wait for the redirect
      // await page.waitForTimeout(30000); // wait for 25 seconds (load locations??)
      await page.waitForTimeout(8000);

  });

    when('I click on the see Landmarks tab', async () => {
      await expect(page).toClick('Link', { text: 'Add a landmark' })
    });

    then('I am able to see the page to see other landmarks', async () => {
      await expect(page).toMatch('See friends\' landmarks')
    });
  })

  afterAll(async ()=>{
    // browser.close()
  })

});