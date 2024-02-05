import { launch } from 'puppeteer';
import { now } from './utils/time.js';
import { fail, done, note, warn } from './utils/todo.js'

async function main() {
  const browser = await launch({
    headless: false,
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

    let tabPointer = 1;

    while (true) {

      // TODO: Click (See more Button) and Click (Close Button)

      console.log(`"Processing tab ${tabPointer}"`);

      await page.waitForSelector('.btn.detalhes');

      let detalhesButtons = await page.$$('.btn.detalhes');

      for (const button of detalhesButtons) {

        await page.waitForTimeout(1000);

        console.log(`"Button ${detalhesButtons.indexOf(button)}"`);

        try {
          await button.click(); // NOTE: Modal opens
        } catch (error) {
          console.log('Fail (Open): ' + error.message);
        }


        try {
          let closeButtons = null;
          let lastCloseButton = null;


          // NOTE: While Button Couldnt Be Loaded to Be Clickabe
          while (lastCloseButton === null || lastCloseButton === undefined || !(await lastCloseButton.isIntersectingViewport())) {
            await page.waitForSelector('.close');
            closeButtons = await page.$$('.close');
            const lastIndex = closeButtons.length - 1;
            lastCloseButton = closeButtons[lastIndex];

            // await page.waitForTimeout(500);  
          }
        
          await lastCloseButton.click();
        } catch (error) {
          fail('Button (Close): ' + error.message);
        }

      }
      // STEP: Goes to Next Page of Members

      const nextTabsLink = await page.$('li a[title="Próxima página"]');
      let linkDisabled;
      const disabledBtns = await page.$$('.disabled');

      if (disabledBtns >= 3) {
        linkDisabled = disabledBtns[2]; // NOTE: Get the third disabled skip button.  
      }

      console.log(nextTabsLink, linkDisabled);

      await extractModal(page);

      // NOTE: There are no more pages to process. Found just one page.
      if (nextTabsLink == null) {
        warn('"Just one tab, break to the next URL"');
        break;
      }

      // NOTE: There are no more pages to process. 
      if (tabPointer > 1 && linkDisabled) {
        warn('"Break to the next URL"');
        break;
      }

      // NOTE: There are no more pages to process. Go to the next page.
      if (nextTabsLink && tabPointer >= 1 && nextTabsLink) {
        note('"Has next tab"');
        await page.evaluate(element => element.click(), nextTabsLink); // Use await here
        tabPointer++;
      }
    }

  } catch (error) {
    fail(`Error scraping project ${projectId}: ${error.message}`);
  } finally {
    await page.close();
  }
}

function spliter(string) {
  const parts = string.split(':');
  const value = parts[1].trim();
  return value;
};

function attrs(string) {
  const parts = string.split(':');
  const value = parts[0].trim();
  return value;
};

let globalInspectAttributes = new Set();

async function extractModal(page) {
  await page.waitForSelector('.modaljs-scroll-overlay');
  const deadModals = await page.$$('.modaljs-scroll-overlay');

  console.log('Number of modals: ' + deadModals.length);

  for (const modal of deadModals) {

    // TODO: tem uma quantidade de p tags
    const paragraphs = await modal.$$('div.modaljs-scroll-overlay p');

    for (let i = 0; i < paragraphs.length; i++) {
      const p = paragraphs[i];
      const text = await p.evaluate(node => node.innerText);
    
      // Add to set if not the first element
      if (i > 0) {
        globalInspectAttributes.add(attrs(text));
      }
    }

    console.log(globalInspectAttributes)
    
    const name = await modal.$eval('div.modaljs-scroll-overlay p strong:nth-child(1)', strong => strong.innerText);

    const matricula = await modal.$eval('div.modaljs-scroll-overlay p:nth-child(2)', strong => strong.innerText); // TODO: implement spliter
    const vinculo = await modal.$eval('div.modaljs-scroll-overlay p:nth-child(3)', strong => strong.innerText);

    const situacao = await modal.$eval('div.modaljs-scroll-overlay p:nth-child(4)', strong => strong.innerText); // MAKE IT HERE  
    const email = await modal.$eval('div.modaljs-scroll-overlay p:nth-child(5)', strong => strong.innerText); // MAKE IT HERE  
    const curso = await modal.$eval('div.modaljs-scroll-overlay p:nth-child(6)', strong => strong.innerText); // MAKE IT HERE  
    const funcao = await modal.$eval('div.modaljs-scroll-overlay p:nth-child(7)', strong => strong.innerText); // MAKE IT HERE 
    const cargaHoraria = await modal.$eval('div.modaljs-scroll-overlay p:nth-child(8)', strong => strong.innerText); // MAKE IT HERE 
    const periodo = await modal.$eval('div.modaljs-scroll-overlay p:nth-child(9)', strong => strong.innerText); // MAKE IT HERE  
    const recebeBolsa = await modal.$eval('div.modaljs-scroll-overlay p:nth-child(10)', strong => strong.innerText); // MAKE IT HERE 

    const data = { name, matricula , vinculo , situacao , email , curso , funcao , cargaHoraria, periodo, recebeBolsa };
    data.matricula = spliter(data.matricula);
    data.vinculo = spliter(data.vinculo);

    console.log(data);
  }
}

main();