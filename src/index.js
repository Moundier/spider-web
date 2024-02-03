import { launch } from 'puppeteer';
import { now } from './utils/time.js';
import { fail, done, info, warn } from './utils/todo.js'

async function main() {
  const browser = await launch({
    headless: true,
  });

  for (let projectId = 74584; projectId >= 0; projectId--) {
    await scrape(projectId, browser);
  }

  await browser.close();
}

const baseUrl = 'https://portal.ufsm.br/projetos/publico/projetos/view.html?idProjeto=';

async function scrape(projectId, browser) {
  const page = await browser.newPage();

  try {
    const projectUrl = `${baseUrl}${projectId}`;
    const response = await page.goto(projectUrl, { waitUntil: 'domcontentloaded' });

    const projectName = await page.$eval('title', (el) => el.textContent.trim());

    // Check for the existence of an error pill element
    const errorPill = await page.$('.error.pill');
    let errorMessage = '';

    if (errorPill != null) {
      errorMessage = await errorPill.evaluate((el) => el.textContent.trim());
    }

    if (errorMessage === "Caminho inválido." || errorMessage === "Este é um projeto confidencial") {
      fail(`${now()} - Project ID: ${projectId} - Page Title: ${projectUrl} - HTTP Status: ${response ? response.status() : 'N/A'} - Error Message: ${errorMessage}`);
      return;
    }

    if (response && response.status() === 200) {
      done(`${now()} - Project ID: ${projectId} - Page Title: ${projectName} - Project URL: ${projectUrl}`);
    }

    let pageCounter = 1;

    while (true) {
      console.log(`Processing page ${pageCounter}`);
  
      await page.waitForSelector('.btn.detalhes');
      const detalhesButtons = await page.$$('.btn.detalhes');
  
      for (const button of detalhesButtons) {
        console.log(`Button ${detalhesButtons.indexOf(button)}`);
        await button.click();
      }

      const nextTabsLink = await page.$('a[title="Próxima página"]');
      const linkDisabled = await page.$('.disabled');

      console.log(nextTabsLink, linkDisabled)

      if (nextTabsLink == null) {
        console.log('"Just one tab"');
        break; // NOTE: Just one tab, break to next url
      }

      if (pageCounter > 1 && linkDisabled) {
        console.log('"No more tabs"');
        break; // NOTE: No more tabs, break to next url
      }

      // NOTE: current page has next tab
      if (pageCounter >= 1 && nextTabsLink) { 
        console.log('"Go to next tab"');
        await nextTabsLink.click();
        pageCounter++;
        // TODO: find a way to get the new buttons
        await page.reload({ waitUntil: 'domcontentloaded' });
      }
    }
  } catch (error) {
    console.error('\x1b[31m', `Error scraping project ${projectId}: ${error.message}`, '\x1b[0m');
  } finally {
    await page.close();
  }
}

main();
