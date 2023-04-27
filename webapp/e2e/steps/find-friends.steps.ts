import { defineFeature, loadFeature } from 'jest-cucumber';
import puppeteer from "puppeteer";

const feature = loadFeature('../features/profile.feature');

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

    when('He searches for garabato', async () => {
      await expect(page).toFill("input[className='searchInput']", "garabato");
      await expect(page).toClick('button', { text: 'Search' })
    });

    then('Some people should appear', async () => {
      await expect(page).toMatch('Usuarios encontrados');
      await expect(page).toMatch('User name: garabato');
    });
  })

  test('The user is logged in the site', ({given,when,then}) => {
    
    let email:string;
    let username:string;

    given('A logged user', () => {
      
    });

    when('When He searches for asdfgh', async () => {
      await expect(page).toFill("input[className='searchInput']", "garabato");
      await expect(page).toClick('button', { text: 'Search' })
    });

    then('No one should appear', async () => {
      await expect(page).toMatch('Usuarios encontrados')
    });
  })

  afterAll(async ()=>{
    browser.close()
  })

});