import { launch } from 'puppeteer';
import { now } from './utils/time.js';
import { fail, done, note, warn } from './utils/todo.js';
import { Program } from './model/program.js';

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

    // TODO: program find

    let programId = null;
    let hyperlinkImage = null;
    let title = await page.$$eval('div.span12 > span', title => title[1].innerText);
    let numberUnique = await page.$$eval('div.span6 > span', title => title[1].innerText); 
    let classification = await page.$$eval('div.span6 > span', title => title[4].innerText);
    
    let summary = await page.$$eval('div.span12 > span', title => title[3].innerText); 
    let objectives = await page.$$eval('div.span12 > span', title => title[5].innerText); 
    let defense = await page.$$eval('div.span12 > span', title => title[7].innerText);  
    let results = await page.$$eval('div.span12 > span', title => title[9].innerText); 

    let dateStart =await page.$$eval('div.span3 > span', title => title[1].innerText);
    let dateFinal =await page.$$eval('div.span3 > span', title => title[3].innerText);
    let publicationDate = null;
    let completionDate = null;
    
    let status = await page.$$eval('div.span6 > span', title => title[14].innerText);
    let keywords = null;

    let program = new Program(
      null,
      null,
      title,
      numberUnique,
      classification,
      summary,
      objectives,
      defense,
      results,
      dateStart,
      dateFinal,
      publicationDate,
      completionDate,
      status,
      keywords
    );
    
    // NOTE: Output reduced for better visualization
    program.title = program.title.substring(0, 50);
    program.summary = program.summary.substring(0, 50);
    program.objectives = program.objectives.substring(0, 50);
    program.defense = program.defense.substring(0, 50);
    program.results = program.results.substring(0, 50);
    
    console.log(program)

    let tabPointer = 1;

    while (true) {

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

let memeberAttributesInspector = new Set();

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
    
      // TODO: Add to set if not the first element
      if (i > 0) {
        memeberAttributesInspector.add(attrs(text));
      }
    }

    
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

  // TODO: Inpect Member Attributes
  console.log(memeberAttributesInspector)
}

main();