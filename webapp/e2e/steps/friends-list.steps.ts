import { defineFeature, loadFeature } from 'jest-cucumber';
import puppeteer from "puppeteer";

const feature = loadFeature('./features/profile.feature');

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

  test('The user is logged in the site', ({given,when,then}) => {
    
    let email:string;
    let username:string;

    given('A logged user', () => {
      
    });

    when('I click on the friends tab', async () => {
      await expect(page).toClick('button', { text: 'Friends' })
    });

    then('I am able to see my friends', async () => {
      await expect(page).toMatch('My Friends')
    });
  })

  afterAll(async ()=>{
    browser.close()
  })

});