import { launch } from 'puppeteer';
import { now } from './utils/time.js';

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
      console.log('\x1b[31m', `Time ${now()} - Project ID: ${projectId} - Page Title: ${projectUrl} - HTTP Status: ${response ? response.status() : 'N/A'} - Error Message: ${errorMessage}`, '\x1b[0m');
      return;
    }

    if (response && response.status() === 200) {
      console.log('\x1b[32m', `Time ${now()} - Project ID: ${projectId} - Page Title: ${projectName} - Project URL: ${projectUrl}`, '\x1b[0m');
    }

  } catch (error) {
    console.error('\x1b[31m', `Error scraping project ${projectId}: ${error.message}`, '\x1b[0m');
  } finally {
    await page.close();
  }
}

main();
