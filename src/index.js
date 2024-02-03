import { launch } from 'puppeteer';
import { now } from './utils/time.js';
import { fail, done, note, warn } from './utils/todo.js'

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
      console.log(`"Processing tab ${pageCounter}"`);
    
      // Move outside the loop to ensure the page is fully loaded
      await page.waitForSelector('.btn.detalhes');
    
      let detalhesButtons = await page.$$('.btn.detalhes');
    
      for (const button of detalhesButtons) {
        console.log(`"Button ${detalhesButtons.indexOf(button)}"`);
        await button.click();
      }
    
      const nextTabsLink = await page.$('li a[title="Próxima página"]');
      // const linkDisabled = await page.$('.disabled');
      let linkDisabled;
      const disabledBtns = await page.$$('.disabled');
    

      if (disabledBtns >= 3) {
        linkDisabled = disabledBtns[2]; // NOTE: Get third skip button that is disabled
      }

      // KEEP: debugging 
      // console.log(nextTabsLink, linkDisabled);
    
      if (nextTabsLink == null) {
        note('"Just one tab, break to the next URL"');
        break; // NOTE: Just One Tab
      }
    
      if (pageCounter > 1 && linkDisabled) {
        note('"Break to the next URL"');
        break; // NOTE: No More Tabs
      }
    
      if (nextTabsLink && pageCounter >= 1 && nextTabsLink) {
        // NOTE: Go to next 
        note('"Has next tab"');
        await page.evaluate(element => element.click(), nextTabsLink); // Use await here
        pageCounter++;
      }
    }
    
  } catch (error) {
    console.error('\x1b[31m', `Error scraping project ${projectId}: ${error.message}`, '\x1b[0m');
  } finally {
    await page.close();
  }
}

main();
