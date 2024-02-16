import { Browser, ElementHandle, HTTPResponse, Page, launch } from 'puppeteer';
import { setTimeout } from "node:timers/promises"
import { now } from './utils/time';
import { fail, done, note, warn } from './utils/todo'
import { Program } from './model/program.model';
import { MemberModel } from './model/member.model.';
import { ProgramEntity } from './entity/program';
import datasource from './config/datasource';
import { DataSource, EntityNotFoundError, Repository } from 'typeorm';
import { MemberEntity } from './entity/member';
import { KeywordEntity } from './entity/keyword';
import { AddressEntity } from './entity/address';
import { ProgramToMember } from './entity/join/program_to_member';
import { ProgramToKeyword } from './entity/join/program_to_keyword';
import { ProgramToAddress } from './entity/join/program_to_address';

const baseUrl = 'https://portal.ufsm.br/projetos/publico/projetos/view.html?idProjeto=';

async function databaseConnection(): Promise<void> {
  try {
    let source: DataSource = await datasource.initialize();
    if (datasource.isInitialized) console.log("DataSource: connected to database");
  } catch (error: unknown) {
    if (error instanceof Error) console.error("Stack trace:", error.stack);
    process.exit(1);
  }
}

async function main(): Promise<void> {

  await databaseConnection();

  const browser = await launch({ headless: false });
  for (let projectId = 73572; projectId >= 0; projectId--) { // 74584 top 74451 test, 
    await scrape(projectId, browser);
  }

  return await browser.close();
}

function handleError(error: any) {
  if (error.code === '23505') {
    warn(`${error.detail}`);
  }
}

const programRepo: Repository<ProgramEntity> = datasource.getRepository(ProgramEntity);
const keywordRepo: Repository<KeywordEntity> = datasource.getRepository(KeywordEntity);
const addressRepo: Repository<AddressEntity> = datasource.getRepository(AddressEntity);
const memberRepo: Repository<MemberEntity> = datasource.getRepository(MemberEntity);

const programHasMemberRepo: Repository<ProgramToMember> = datasource.getRepository(ProgramToMember);
const programToKeywordRepo: Repository<ProgramToKeyword> = datasource.getRepository(ProgramToKeyword);
const programToAddressRepo: Repository<ProgramToAddress> = datasource.getRepository(ProgramToAddress);

let programPanelDataInspector: Set<string> = new Set(); // Dados Basicos, Inovacao e gesto financeira, Classificacoes, Participantes, Orgaos, Cidades de atuacao, Publico Alvo, Plano de Trabalho
let programClassificInspector: Set<string> = new Set(); // ENSINO, PESQUISA, EXTENSAO, DESENVOLVIMENTO_INSTITUCIOAL,
let programSituationInspector: Set<string> = new Set(); // SUSPENSO, CONCLUIDO_PUBLICADO, CANCELADO, EM_ANDAMENTO  
let memberAttributesInspector: Set<string> = new Set(); // MATRÍCULA, VÍNCULO, SITUAÇÃO DO VÍNCULO, E-MAIL, LOTAÇÃO DE EXERCÍCIO, LOTAÇÃO OFICIAL, FUNÇÃO NO PROJETO, CARGA HORÁRIA, PERÍODO, RECEBE BOLSA PELO PROJETO, CURSO
let memberAcademicRole: Set<string> = new Set(); //  Coordenador, Participante, Autor 

async function scrape(projectId: number, browser: Browser) {
  const page: Page = await browser.newPage();

  try {
    const projectUrl: string = `${baseUrl}${projectId}`.toString();
    const response: (HTTPResponse | null) = await page.goto(projectUrl, { waitUntil: 'domcontentloaded' });

    const projectName: any = await page.$eval('title', (el: any) => el.textContent.trim());

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
    // const panelTitles: string = await page.$$eval('.panel-title', (titles: any) => titles.map((title: any) => title.textContent.trim()));

    // for (const title of panelTitles) {
    //   programPanelDataInspector.add(title);
    // }

    // TODO: get program
    let programId = null;
    let hyperlinkImage = null;
    let title = await page.$$eval('div.span12 > span', (element: any) => element[1].innerText);
    let numberUnique = await page.$$eval('div.span6 > span', (element: any) => element[1].innerText);
    let classification = await page.$$eval('div.span6 > span', (element: any) => element[4].innerText);
    let summary = await page.$$eval('div.span12 > span', (element: any) => element[3].innerText);
    let objectives = await page.$$eval('div.span12 > span', (element: any) => element[5].innerText);
    let defense = await page.$$eval('div.span12 > span', (element: any) => element[7].innerText);
    let results = await page.$$eval('div.span12 > span', (element: any) => element[9].innerText);
    let dateStart = await page.$$eval('div.span3 > span', (element: any) => element[1].innerText);
    let dateFinal = await page.$$eval('div.span3 > span', (element: any) => element[3].innerText);
    let status = await page.$$eval('div.span6 > span', (element: any) => element[14].innerText);

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
      status,
      hyperlink: projectUrl
    };

    // TODO: save the program entity
    let programEntity: ProgramEntity = programToEntity(program);

    try {
      const foundProgram = await programRepo.findOne({ where: { numberUnique: programEntity.numberUnique } });

      if (foundProgram) {
        programEntity = foundProgram;
        console.log(`Id: ` + foundProgram.programId);
      }

      if (foundProgram === null) {
        await programRepo.save(programEntity); // TODO: If not found, save program
      }

    } catch (error: any) {
      console.log('Entity (Program) error');
      handleError(error);
    }

    // NOTE: output reduced for better visualization
    program.title = program.title ? program.title.substring(0, 50) : null;
    program.summary = program.summary ? program.summary.substring(0, 50) : null;
    program.objectives = program.objectives ? program.objectives.substring(0, 50) : null;
    program.defense = program.defense ? program.defense.substring(0, 50) : null;
    program.results = program.results ? program.results.substring(0, 50) : null;

    // TODO: program inspections
    // console.log(program); 
    // console.log(programPanelDataInspector);
    // console.log(programClassificInspector);
    // console.log(programSituationInspector);
    // console.log(memberAttributesInspector);
    // console.log(memberAcademicRole);

    // TODO: collect keywords of programs
    let keywords: any[] = await page.$$eval('div.span3 > span', (keys: any) => {
      return [
        keys[5].innerText,
        keys[7].innerText,
        keys[9].innerText,
        keys[11].innerText,
      ];
    });

    // TODO: save program keyword's
    for (const keyword of keywords) {

      const program_to_keyword = new ProgramToKeyword();
      program_to_keyword.program = programEntity;

      let keywordEntity: KeywordEntity = { keywordName: keyword };
      let foundKeyword;

      try {
        foundKeyword = await keywordRepo.findOne({ where: { keywordName: keyword } });
      } catch (error: any) {
        console.log('Find keyword error');
        handleError(error);
      }

      try {
        if (foundKeyword === null) {
          // console.log(`Didnt exists ${keywordEntity.keywordName}`);
          await keywordRepo.save(keywordEntity); // TODO: Save keyword, if not found        
        } else {
          // console.log(`Already exist '${keywordEntity.keywordName}'`);
        }
      } catch (error: any) {
        console.log('Save keyword error');
        handleError(error);
      }

      // TODO: association of 'program' and 'keyword' 
      program_to_keyword.keyword = keywordEntity;

      if (foundKeyword) {
        program_to_keyword.keyword = foundKeyword; // NOTE: If found, uses existing keyword from mapping table.
      }

      // TODO: does an association already exists
      const associationExists = await programToKeywordRepo.findOne({ where: { program: programEntity, keyword: keywordEntity } });
      // console.log(programEntity.programId, keywordEntity.keywordName); // NOTE: Debugging purposes

      if (associationExists) {
        // console.log(`Already exists. Association of ${program.programId} and ${keywordEntity.keywordId}`);
        continue; // TODO: Alredy exists. Goes to next iteration.
      }

      try {
        await programToKeywordRepo.save(program_to_keyword); // TODO: save keyword to program        
      } catch (error: any) {
        console.log(`Error saving association: ${error.message}`);
      }
    }

    // TODO: keywords of programs
    const keys = `${' '.repeat(6)}╰─── ${JSON.stringify([...keywords])}`;
    console.log(keys);

    // TODO: address of programs
    let addressElement = await page.$$eval('div.panel-title', (element: any) => element[5].innerText);
    const addressFix = addressElement.substring(1, addressElement.length);

    // TODO: ternary expression for regions panel on portal (dataExists || null)
    let datas: ([] | any) = (addressFix === "Cidades de atuação")
      ? await page.$$eval('div.panel-content', (element: any) => element[5].innerText.split('\n'))
      : null;

    let cities: string[] = [];
    let states: string[] = [];

    // TODO: Parsing and separate the addressses from the cities panel title
    for (let i = 0; datas === null || i < datas.length; i++) {

      if (datas === null) {
        console.log(`Cidades: `)
        console.log(`${' '.repeat(6)}╰───`, ['Not informed']);
        break;
      }

      // NOTE: The third column contains the addresses 
      if (datas.indexOf(datas[i]) >= 3) {
        console.log(`Cidades: `);
        console.log(`${' '.repeat(6)}╰───`, datas[i].split('\t'));
        const addressesSplitted: string[] = datas[i].split('\t');
        // NOTE: collect cities and states 
        cities.push(addressesSplitted[0]);
        states.push(addressesSplitted[1]);
      }
    }

    // TODO: Saving addresses and linking to program
    for (let i = 0; (cities.length === 0) || (i < cities.length); ++i) {

      const addressEntity: AddressEntity = { };

      if (cities.length === 0) {
        console.log(`None to save: ${cities.length}`);
        break;
      }

      addressEntity.city = cities[i];
      addressEntity.state = states[i];
      addressEntity.campus = getCampusFromCity(addressEntity.city) ?? undefined;

      // TODO: address section

      const programToAddress = new ProgramToAddress();
      let foundAddress;

      try {
        foundAddress = await addressRepo.findOne({ where: { city: addressEntity.city, state: addressEntity.state, campus: addressEntity.campus } });
      } catch (error: any) {
        console.log(`Error: finding address ` + error.message);
      }
      
      try {
        if (foundAddress === null) {
          console.log('Didnt exist');
          await addressRepo.save(addressEntity); // NOTE: save if not found
        }
      } catch (error: any) {        
        console.log(`Error: saving address ` + error.message);
      }

      programToAddress.program = programEntity;

      if (foundAddress) {
        console.log(`Found ` + JSON.stringify(foundAddress).substring(0, 80));
        programToAddress.address = foundAddress; // NOTE: If found, uses existing keyword from mapping table.
      }

      const foundAssociation = await programToAddressRepo.findOne({ where: { program: programEntity, address: addressEntity }}); 

      if (foundAssociation) {
        console.log(`Already exists. Association of ${programEntity.programId} and ${foundAddress?.addressId}`);
        continue; // NOTE: found association (already exists). Go to next address.
      }

      try {
        await programToAddressRepo.save(programToAddress); 
      } catch (error: any) {
        console.log(`Error on associating (saving): ${error.message}`);
      }
    }


    // TODO: asynchronous open and close all member modals 

    let tabPointer = 1;

    while (true) {

      // console.log(`"Processing tab ${tabPointer}"`); IMPORTANT
      await page.waitForSelector('.btn.detalhes');
      let detalhesButtons = await page.$$('.btn.detalhes');

      for (const button of detalhesButtons) {

        await setTimeout(500); // timeout
        // console.log(`"Button ${detalhesButtons.indexOf(button)}"`); IMPORTANT

        try {
          await button.click(); /// TODO: Open the modal
        } catch (error: any) {
          fail('Failure on modal open: ' + error.message);
        }

        // TODO: close the modal

        try {
          let closeButtons: any = null;
          let lastCloseButton: any = null;

          while (lastCloseButton === null || lastCloseButton === undefined || !(await lastCloseButton.isIntersectingViewport())) {
            closeButtons = await page.$$('.close');
            const lastIndex: number = closeButtons.length - 1;
            lastCloseButton = closeButtons[lastIndex];
          }

          await lastCloseButton.click();
        } catch (error: any) {
          fail('Button (Close): ' + error.message);
        }
      }

      const nextTabsLink: ElementHandle<Element> | null = await page.$('li a[title="Próxima página"]');
      const disabledBtns: ElementHandle<Element>[] | null = await page.$$('.disabled');
      const linkDisabled: ElementHandle<Element> = disabledBtns[2]; // NOTE: Obtain third inactive skip button. (0, 1, 2)

      // NOTE: Division for better visual debugging
      console.log('-'.repeat(100));

      let members: MemberModel[] | null = await getMemberFromModal(page);
      for (const m of members ?? []) {
        // TODO: save each member entity
        // TODO: program to member assoc_program_member(memberId, programId)
      }

      // console.log(members);

      // NOTE: break or pass to next page of members

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

function getCampusFromCity(city: string | null | undefined): (string | null) {
  switch (city) {
    case 'Santa Maria':
      return 'Campus Sede';
    case 'Frederico Westphalen':
      return 'Campus de Frederico Westphalen';
    case 'Palmeira das Missões':
      return 'Campus de Palmeira das Missões';
    case 'Cachoeira do Sul':
      return 'Campus de Cachoeira do Sul';            
    default:
      break;
  }

  return null;
}

function getKey(string: string): string {
  const parts = string.split(':');
  const value = parts[0].trim();
  return value;
};

function programToEntity(program: Program): ProgramEntity {
  const entity = new ProgramEntity();
  entity.programId = program.programId;
  entity.imageSource = program.imageSource ?? null;
  entity.domainImageSource = program.domainImageSource;
  entity.title = program.title;
  entity.numberUnique = program.numberUnique ?? '';
  entity.classification = program.classification;
  entity.summary = program.summary ?? null;
  entity.objectives = program.objectives ?? null;
  entity.defense = program.defense ?? null;
  entity.results = program.results ?? null;
  entity.dateStart = program.dateStart ?? null;
  entity.dateFinal = program.dateFinal ?? null;
  entity.status = program.status;
  entity.hyperlink = program.hyperlink;
  return entity;
}

async function getMemberFromModal(page: Page): Promise<MemberModel[] | null> {

  // await page.waitForSelector('.modaljs-scroll-overlay');
  const deadModals: ElementHandle<Element>[] = await page.$$('.modaljs-scroll-overlay');
  const members: MemberModel[] = [];

  for (const modal of deadModals) {

    // NOTE: Must be inner loop.
    let member: MemberModel = {
      memberId: null,
      name: null,
      matricula: null,
      vinculo: null,
      vinculoStatus: null,
      email: null,
      imageSource: null,
      lotacaoExercicio: null,
      lotacaoOficial: null,
      memberRole: null, // TODO: to go
      cargaHoraria: null, // TODO: to go
      periodo: null, // TODO: to go
      recebeBolsa: null, // TODO: to go
      curso: null,
      bolsa: null, // TODO: to go
      valor: null  // TODO: to go
    };

    const paragraphs: ElementHandle<HTMLParagraphElement>[] = await modal.$$('div.modaljs-scroll-overlay p');

    try {
      const base64Image: string = await modal.$eval('div.modaljs-scroll-overlay .span3 img', (image: any) => image.src);
      member.imageSource = base64Image.substring(0, 80); // NOTE: temporarely
    } catch (error: unknown) {
      member.imageSource = null; // NOTE: It's an icon tag
    }

    for (const p of paragraphs) {

      const text: string = await p.evaluate((el: any) => el.innerText);
      let [key, value]: any = text.split(':');

      if (value) {
        value = value.substring(1, value.lenght); // TODO: Ignore the first character at postiion '0'
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

    // TODO: save member
    // TODO: save program member associative table

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
    // get the saved program 
    // save association with each

    members.push(member);
    // return member;
  }

  // console.log(members);

  return members;
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

main().then(
  (success: any) => {
    // TODO: Some task on success
  },
  (failure: any) => {
    // TODO: Some task on failure
  }
).catch((error: unknown) => { 
  // Handle error here
  console.log(error); 
}).finally(() => {
  console.log(`Finally block executed`)
});