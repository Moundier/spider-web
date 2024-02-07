import { launch } from 'puppeteer';
import { now } from './utils/time.js';
import { fail, done, note, warn } from './utils/todo.js';
import { Program } from './model/program.js';

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

let programPanelDataInspector = new Set(); // Dados Basicos, Inovacao e gesto financeira, Classificacoes, Participantes, Orgaos, Cidades de atuacao, Publico Alvo, Plano de Trabalho
let programClassificInspector = new Set(); // ENSINO, PESQUISA, EXTENSAO, DESENVOLVIMENTO_INSTITUCIOAL,
let programSituationInspector = new Set(); // SUSPENSO, CONCLUIDO_PUBLICADO, CANCELADO, EM_ANDAMENTO  
let memberAttributesInspector = new Set(); // MATRÍCULA, VÍNCULO, SITUAÇÃO DO VÍNCULO, E-MAIL, LOTAÇÃO DE EXERCÍCIO, LOTAÇÃO OFICIAL, FUNÇÃO NO PROJETO, CARGA HORÁRIA, PERÍODO, RECEBE BOLSA PELO PROJETO, CURSO
let memberAcademicRole = new Set(); //  Coordenador, Participante, Autor 

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

    // TODO: get panel titles
    const panelTitles = await page.$$eval('.panel-title', titles => titles.map(title => title.textContent.trim()));
  
    for (const title of panelTitles) {
      programPanelDataInspector.add(title);
    }

    // TODO: get program

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

    // TODO: Set of Status
    programClassificInspector.add(classification);

    // TODO: Set of Classifications
    programSituationInspector.add(status);

    // TODO: Program
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
    
    // TODO: program
    // console.log(program); 
    console.log();
    console.log(programPanelDataInspector);
    console.log(programClassificInspector);
    console.log(programSituationInspector);
    console.log(memberAttributesInspector);
    console.log(memberAcademicRole);

    let tabPointer = 1;

    while (true) {

      console.log(`"Processing tab ${tabPointer}"`);
      await page.waitForSelector('.btn.detalhes');
      let detalhesButtons = await page.$$('.btn.detalhes');

      for (const button of detalhesButtons) {

        await page.waitForTimeout(600);
        console.log(`"Button ${detalhesButtons.indexOf(button)}"`);

        try {
          await button.click(); // NOTE: Open the modal
        } catch (error) {
          fail('Failure on modal open: ' + error.message);
        }

        try {
          let closeButtons = null;
          let lastCloseButton = null;

          while (lastCloseButton === null || lastCloseButton === undefined || !(await lastCloseButton.isIntersectingViewport())) {
            await page.waitForSelector('.close');
            closeButtons = await page.$$('.close');
            const lastIndex = closeButtons.length - 1;
            lastCloseButton = closeButtons[lastIndex];
          }
        
          await lastCloseButton.click();

        } catch (error) {
          fail('Button (Close): ' + error.message);
        }
      }

      // STEP: Goes to Next Page of Members
      let linkDisabled;
      const nextTabsLink = await page.$('li a[title="Próxima página"]');
      const disabledBtns = await page.$$('.disabled');

      if (disabledBtns >= 3) {
        linkDisabled = disabledBtns[2]; // NOTE: Get the third disabled skip button.  
      }

      console.log(nextTabsLink, linkDisabled);

      await extractModal(page);

      // NOTE: Found one tab. Break to the next. (nextNotFound)
      if (nextTabsLink == null) {
        warn('"Just one tab, break to the next URL"'); 
        break;
      }
      
      // NOTE: No more tabs. Break to the next; (currentIsLast)
      if (tabPointer > 1 && linkDisabled) {
        warn('"Break to the next URL"'); 
        break;
      }

      // NOTE: Found more Tabs. Iterate! (goToNextTab)
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

async function extractModal(page) {

  await page.waitForSelector('.modaljs-scroll-overlay');
  const deadModals = await page.$$('.modaljs-scroll-overlay');

  console.log('Number of modals: ' + deadModals.length);

  for (const modal of deadModals) {

    // for (const f of FieldsToExtract) {
    //   console.log(f)
    // }

    const paragraphs = await modal.$$('div.modaljs-scroll-overlay p');

    console.log('-'.repeat(100))
    for (const p of paragraphs) {
      const text = await p.evaluate(element => element.innerText);
      const key = text.split(':')[0];
      const val = text.split(':')[1];

      if (paragraphs.indexOf(p) > 0) {
        memberAttributesInspector.add(attrs(text)); // TODO: Add to set
        console.log(`index: ${paragraphs.indexOf(p)} key: ${key}, val: ${val}`);  // TODO: set value to corresponding key

        if (key === 'Função no projeto') {
          memberAcademicRole.add(val);
        }
      }
    }

    // const name = await modal.$eval('div.modaljs-scroll-overlay p strong:nth-child(1)', strong => strong.innerText);
    // const matricula = await modal.$eval('div.modaljs-scroll-overlay p:nth-child(2)', strong => strong.innerText); // TODO: implement spliter
    // const vinculo = await modal.$eval('div.modaljs-scroll-overlay p:nth-child(3)', strong => strong.innerText);
    // const situacao = await modal.$eval('div.modaljs-scroll-overlay p:nth-child(4)', strong => strong.innerText); // MAKE IT HERE  
    // const email = await modal.$eval('div.modaljs-scroll-overlay p:nth-child(5)', strong => strong.innerText); // MAKE IT HERE  
    // const curso = await modal.$eval('div.modaljs-scroll-overlay p:nth-child(6)', strong => strong.innerText); // MAKE IT HERE  
    // const funcao = await modal.$eval('div.modaljs-scroll-overlay p:nth-child(7)', strong => strong.innerText); // MAKE IT HERE 
    // const cargaHoraria = await modal.$eval('div.modaljs-scroll-overlay p:nth-child(8)', strong => strong.innerText); // MAKE IT HERE 
    // const periodo = await modal.$eval('div.modaljs-scroll-overlay p:nth-child(9)', strong => strong.innerText); // MAKE IT HERE  
    // const recebeBolsa = await modal.$eval('div.modaljs-scroll-overlay p:nth-child(10)', strong => strong.innerText); // MAKE IT HERE 

    // const data = { name, matricula , vinculo , situacao , email , curso , funcao , cargaHoraria, periodo, recebeBolsa };
    // data.matricula = spliter(data.matricula);
    // data.vinculo = spliter(data.vinculo);

    // console.log(data);
  }
}

main();