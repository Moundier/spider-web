import { Browser, ElementHandle, Page, launch } from 'puppeteer';
import { now } from './utils/time';
import { fail, done, note, warn } from './utils/todo'
import { Program } from './model/program';

const baseUrl = 'https://portal.ufsm.br/projetos/publico/projetos/view.html?idProjeto=';

async function main(): Promise<void> {

  const browser = await launch({ headless: false });
  for (let projectId = 74451; projectId >= 0; projectId--) { // 74584 top 74502 test 74510 test2 ERROR: 74449 
    await scrape(projectId, browser);
  }

  return await browser.close();
}

let programPanelDataInspector: Set<string> = new Set(); // Dados Basicos, Inovacao e gesto financeira, Classificacoes, Participantes, Orgaos, Cidades de atuacao, Publico Alvo, Plano de Trabalho
let programClassificInspector: Set<string> = new Set(); // ENSINO, PESQUISA, EXTENSAO, DESENVOLVIMENTO_INSTITUCIOAL,
let programSituationInspector: Set<string> = new Set(); // SUSPENSO, CONCLUIDO_PUBLICADO, CANCELADO, EM_ANDAMENTO  
let memberAttributesInspector: Set<string> = new Set(); // MATRÍCULA, VÍNCULO, SITUAÇÃO DO VÍNCULO, E-MAIL, LOTAÇÃO DE EXERCÍCIO, LOTAÇÃO OFICIAL, FUNÇÃO NO PROJETO, CARGA HORÁRIA, PERÍODO, RECEBE BOLSA PELO PROJETO, CURSO
let memberAcademicRole: Set<string> = new Set(); //  Coordenador, Participante, Autor 

async function scrape(projectId: number, browser: Browser) {
  const page = await browser.newPage();

  try {
    const projectUrl = `${baseUrl}${projectId}`;
    const response = await page.goto(projectUrl, { waitUntil: 'domcontentloaded' });

    const projectName = await page.$eval('title', (el: any) => el.textContent.trim());

    // TODO: inspect values and error returns
    const errorPill: ElementHandle<Element> | null = await page.$('.error.pill');
    let errorMessage: string = '';

    if (errorPill != null) {
      errorMessage = await errorPill.evaluate((el: any) => el.textContent.trim());
    }

    if (errorMessage === "Caminho inválido." || errorMessage === "Este é um projeto confidencial") {
      fail(`${now()} HTTP Status: ${response ? response.status() : 'N/A'} - ${projectUrl} - Error: ${errorMessage}`);
      return;
    }

    if (response && response.status() === 200) {
      done(`${now()} Found url: ${projectUrl}`);
    }

    // TODO: get panel titles
    const panelTitles: string = await page.$$eval('.panel-title', (titles: any) => titles.map((title: any) => title.textContent.trim()));
  
    for (const title of panelTitles) {
      programPanelDataInspector.add(title);
    }

    // TODO: get program
    let programId = null;
    let hyperlinkImage = null;
    let title = await page.$$eval('div.span12 > span', (title: any) => title[1].innerText);
    let numberUnique = await page.$$eval('div.span6 > span', (title: any) => title[1].innerText); 
    let classification = await page.$$eval('div.span6 > span', (title: any) => title[4].innerText);
    let summary = await page.$$eval('div.span12 > span', (title: any) => title[3].innerText); 
    let objectives = await page.$$eval('div.span12 > span', (title: any) => title[5].innerText); 
    let defense = await page.$$eval('div.span12 > span', (title: any) => title[7].innerText);  
    let results = await page.$$eval('div.span12 > span', (title: any) => title[9].innerText); 
    let dateStart = await page.$$eval('div.span3 > span', (title: any) => title[1].innerText);
    let dateFinal = await page.$$eval('div.span3 > span', (title: any) => title[3].innerText);
    let status = await page.$$eval('div.span6 > span', (title: any) => title[14].innerText);
    // let keywords = new Set<string>();

    // TODO: collect hyperlink
    const hyperlink = projectUrl; // NOTE: repeated

    // TODO: set of status
    programClassificInspector.add(classification);

    // TODO: set of classifications
    programSituationInspector.add(status);

    // TODO: program attributes
    let program: Program = {
      programId: 0,
      imageSource: '',
      domainImageSource: '',
      title,
      numberUnique,
      classification,
      summary,
      objectives,
      defense,
      results,
      dateStart,
      dateFinal,
      // publicationDate, // TODO: to go
      // completionDate, // TODO: to go
      status,
      hyperlink
    };
    
    // NOTE: output reduced for better visualization

    program.title = program.title ? program.title.substring(0, 50) : null;
    program.summary = program.summary ? program.summary.substring(0, 50) : null;
    program.objectives = program.objectives ? program.objectives.substring(0, 50) : null; 
    program.defense = program.defense ?  program.defense.substring(0, 50) : null;
    program.results = program.results ? program.results.substring(0, 50) : null;
    
    // TODO: program inspections
    // console.log(program); 
    // console.log(programPanelDataInspector);
    // console.log(programClassificInspector);
    // console.log(programSituationInspector);
    // console.log(memberAttributesInspector);
    // console.log(memberAcademicRole);

    // TODO: collect keywords of programs
    let keywords = await page.$$eval('div.span3 > span', (keys: any) => {
      return [
        keys[5].innerText,
        keys[7].innerText,
        keys[9].innerText,
        keys[11].innerText,
      ]
    });
    
    console.log(`${' '.repeat(6)}╰────`, JSON.stringify([...keywords]));

    // TODO: If panel-title number x equals Cidades de atuacao
    // TO DO: collect to list

    let address = await page.$$eval('div.panel-title', (title: any) => title[5].innerText);
    address = address.substring(1, address.length);
    let region = [];

    if (address === "Cidades de atuação") {

      let datas = await page.$$eval('div.panel-content', (title: any) => title[5].innerText.split('\n'));

      for (let i = 3; i > 2 && i < datas.length; i++) {
        console.log(`${' '.repeat(6)}╰────`, datas[i].split('\t'));        
      }

      // // TODO: works, but not for a list of cities
      // let lines = data.split('\n'); // TODO: split lines
      // console.log(`Data: ${lines[3]}`);
    } else {
      // TODO: assume to be santa maria the null ones
      console.log(`${' '.repeat(6)}╰────`, ['Not informed']);
    }

    // TODO: collect members by pages

    let tabPointer = 1;

    while (true) {

      // console.log(`"Processing tab ${tabPointer}"`); IMPORTANT
      await page.waitForSelector('.btn.detalhes');
      let detalhesButtons = await page.$$('.btn.detalhes');

      // TODO: pass through all buttons
      for (const button of detalhesButtons) {

        await page.waitForTimeout(500); // timeout
        // console.log(`"Button ${detalhesButtons.indexOf(button)}"`); IMPORTANT

        // TODO: open the modal

        try {
          await button.click();
        } catch (error: any) {
          fail('Failure on modal open: ' + error.message);
        }

        // TODO: close the modal

        try {
          let closeButtons: any = null;
          let lastCloseButton: any = null;

          while (lastCloseButton === null || lastCloseButton === undefined || !(await lastCloseButton.isIntersectingViewport())) {
            await page.waitForSelector('.close');
            closeButtons = await page.$$('.close');
            const lastIndex = closeButtons.length - 1;
            lastCloseButton = closeButtons[lastIndex];
          }
        
          await lastCloseButton.click();

        } catch (error: any) {
          fail('Button (Close): ' + error.message);
        }
      }

      // NOTE: goes to next page of members
      let linkDisabled;
      const nextTabsLink: any = await page.$('li a[title="Próxima página"]');
      const disabledBtns: any = await page.$$('.disabled');

      if (disabledBtns >= 3) {
        linkDisabled = disabledBtns[2]; // NOTE: Get the third disabled skip button.  
      }

      // console.log(nextTabsLink, linkDisabled); IMPORTANT

      // TODO: get member from modal
      await getMemberFromModal(page);

      // TODO: pass or break conditions

      // NOTE: got just one tab. Break to the next. (nextNotFound)
      if (nextTabsLink == null) {
        // warn('"Just one tab, break to the next URL"'); IMPORTANT
        break;
      }
      
      // NOTE: no more tabs. Break to the next; (currentIsLast)
      if (tabPointer > 1 && linkDisabled) {
        // warn('"Break to the next URL"'); IMPORTANT
        break;
      }

      // NOTE: Found more Tabs. Iterate! (goToNextTab)
      if (nextTabsLink && tabPointer >= 1 && nextTabsLink) {
        // note('"Has next tab"'); IMPORTANT
        await page.evaluate((element: any) => element.click(), nextTabsLink); // Use await here
        tabPointer++;
      }
    }

  } catch (error: any) {
    fail(`Error scraping project ${projectId}: ${error.message}`);
  } finally {
    await page.close();
  }
}

function getKey(string: string) {
  const parts = string.split(':');
  const value = parts[0].trim();
  return value;
};

async function getMemberFromModal(page: any): Promise<void> {

  await page.waitForSelector('.modaljs-scroll-overlay');
  const deadModals = await page.$$('.modaljs-scroll-overlay');

  // console.log('Number of modals: ' + deadModals.length); IMPORTANT

  for (const modal of deadModals) {

    // NOTE: must be null here. If not, it inherits incorrectly the previous member attributes
    let member: Member = {
      memberId: null,
      name: null,
      matricula: null,
      vinculo: null,
      vinculoStatus: null,
      email: null,
      imageSource: null,
      lotacaoExercicio: null,
      lotacaoOficial: null,
      memberRole: null,
      cargaHoraria: null,
      periodo: null,
      recebeBolsa: null,
      curso: null,
      bolsa: null,
      valor: null
    };

    const paragraphs = await modal.$$('div.modaljs-scroll-overlay p');

    // console.log('-'.repeat(100)); // NOTE: a divisor between members
    
    try {
      // NOTE: Get Base64 image source from modal if available
      const base64Image = await modal.$eval('div.modaljs-scroll-overlay .span3 img', (image: any) => image.src); 
      member.imageSource = base64Image.substring(0, 80); // NOTE: temporarely
    } catch (error: any) {
      // NOTE: If image not found, set empty string and note as icon
      member.imageSource = null;
      // note('Image is an icon'); IMPORTANT
    }

    for (const p of paragraphs) {

      const text = await p.evaluate((el: any) => el.innerText);
      let [key, value]: any = text.split(':');
      
      if (value) {
        value = value.substring(1, value.lenght);
      }

      switch (key) {
        case MemberDetails.Matricula:
          member.matricula = value.trim();
          break;
        case MemberDetails.Vinculo:
          member.vinculo = value.trim();
          break;
        case MemberDetails.SituacaoVinculo:
          member.vinculoStatus = value.trim();
          break;
        case MemberDetails.Email:
          member.email = value.trim();
          break;
        case MemberDetails.LotacaoExercicio:
          member.lotacaoExercicio = value.trim();
          break;
        case MemberDetails.LotacaoOficial:
          member.lotacaoOficial = value.trim();
          break;
        case MemberDetails.FuncaoProjeto:
          member.memberRole = value.trim();
          break;
        case MemberDetails.CargaHoraria:
          member.cargaHoraria = value.trim();
          break;
        case MemberDetails.Periodo:
          member.periodo = value.trim();
          break;
        case MemberDetails.RecebeBolsaPeloProjeto:
          member.recebeBolsa = value.trim();
          break;
        case MemberDetails.Curso:
          member.curso = value.trim();
          break;
        case MemberDetails.Bolsa:
          member.bolsa = value.trim();
          break;
        case MemberDetails.Valor:
          member.valor = value.trim();
          break;
        default:
          // note(`Unknown key (possibly name): ${key}`);
          member.name = key.trim();
          break;
      }

      if (paragraphs.indexOf(p) > 0) {
        // TODO: add to set
        memberAttributesInspector.add(getKey(text)); 

        // NOTE: inspect keys and values
        // console.log(`index: ${paragraphs.indexOf(p)} key: ${key}, val: ${value}`);

        if (key === 'Função no projeto') {
          memberAcademicRole.add(value);
        }
      }
    }

    // const matricula = await modal.$eval('div.modaljs-scroll-overlay p:nth-child(2)', strong => strong.innerText); // TODO: implement getVal
    // const vinculo = await modal.$eval('div.modaljs-scroll-overlay p:nth-child(3)', strong => strong.innerText);
    // const situacao = await modal.$eval('div.modaljs-scroll-overlay p:nth-child(4)', strong => strong.innerText); // MAKE IT HERE  
    // const email = await modal.$eval('div.modaljs-scroll-overlay p:nth-child(5)', strong => strong.innerText); // MAKE IT HERE  
    // const curso = await modal.$eval('div.modaljs-scroll-overlay p:nth-child(6)', strong => strong.innerText); // MAKE IT HERE  
    // const funcao = await modal.$eval('div.modaljs-scroll-overlay p:nth-child(7)', strong => strong.innerText); // MAKE IT HERE 
    // const cargaHoraria = await modal.$eval('div.modaljs-scroll-overlay p:nth-child(8)', strong => strong.innerText); // MAKE IT HERE 
    // const periodo = await modal.$eval('div.modaljs-scroll-overlay p:nth-child(9)', strong => strong.innerText); // MAKE IT HERE  
    // const recebeBolsa = await modal.$eval('div.modaljs-scroll-overlay p:nth-child(10)', strong => strong.innerText); // MAKE IT HERE 

    // const data = { name, matricula , vinculo , situacao , email , curso , funcao , cargaHoraria, periodo, recebeBolsa };
    // data.matricula = getVal(data.matricula);
    // data.vinculo = getVal(data.vinculo);
    // console.log(data);

    // console.log(member); // NOTE: maintain
  }
}

enum MemberDetails {
  Matricula = 'Matrícula',
  Vinculo = 'Vínculo',
  SituacaoVinculo = 'Situação do vínculo',
  Email = 'E-mail',
  LotacaoExercicio = 'Lotação de Exercício',
  LotacaoOficial = 'Lotação Oficial',
  FuncaoProjeto = 'Função no projeto',
  CargaHoraria = 'Carga horária',
  Periodo = 'Período',
  RecebeBolsaPeloProjeto = 'Recebe bolsa pelo projeto',
  Curso = 'Curso',
  Bolsa = 'Bolsa',
  Valor = 'Valor'
}

main().catch((error: any) => console.log(error));