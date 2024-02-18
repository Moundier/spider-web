import { Browser, ElementHandle, HTTPResponse, Page, launch } from 'puppeteer';
import { now } from './utils/time';
import { fail, done, warn } from './utils/todo'
import { MemberDto } from './model/member.dto';
import { ConnectionIsNotSetError, ConnectionNotFoundError, DataSource, Repository } from 'typeorm';
import { ProgramEntity } from './entity/program';
import { MemberEntity } from './entity/member';
import { KeywordEntity } from './entity/keyword';
import { AddressEntity } from './entity/address';
import { ProgramToMember } from './entity/join/program_to_member';
import { ProgramToKeyword } from './entity/join/program_to_keyword';
import { ProgramToAddress } from './entity/join/program_to_address';

import { setTimeout } from "node:timers/promises";
import datasource from './config/datasource';

const baseUrl = 'https://portal.ufsm.br/projetos/publico/projetos/view.html?idProjeto=';

async function databaseConnection(): Promise<void> {
  try {
    let source: DataSource = await datasource.initialize();
    if (datasource.isInitialized) console.log("DataSource: connected to database");
  } catch (error: any) {
    if (error.code === 'ECONNREFUSED') fail(`(Error) postgresql: is postgres service running? Go verify.`);
    process.exit(1);
  }
}

async function main(): Promise<void> {

  await databaseConnection();

  const browser = await launch({ headless: false });
  for (let projectId = 74584; projectId >= 0; projectId--) { // 74584 top 
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

const programToMemberRepo: Repository<ProgramToMember> = datasource.getRepository(ProgramToMember);
const programToKeywordRepo: Repository<ProgramToKeyword> = datasource.getRepository(ProgramToKeyword);
const programToAddressRepo: Repository<ProgramToAddress> = datasource.getRepository(ProgramToAddress);

let programPanelDataInspector: Set<string> = new Set();
let programClassificInspector: Set<string> = new Set();
let programSituationInspector: Set<string> = new Set();   
let memberAttributesInspector: Set<string> = new Set();
let memberAcademicRole: Set<string> = new Set(); 

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

    // TODO: debugging
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

    // TODO: debugging
    // programClassificInspector.add(classification);

    // TODO: debugging
    // programSituationInspector.add(status);

    // TODO: section of program persistence

    let programEntity: ProgramEntity = { };
    // programEntity.programId = 0; // NOTE: Not necessary because typeorm generates automatically.
    programEntity.title = title;
    programEntity.hyperlink = projectUrl;
    programEntity.numberUnique = numberUnique;
    programEntity.classification = classification;
    programEntity.summary = summary;
    programEntity.objectives = objectives;
    programEntity.defense = defense;
    programEntity.results = results;
    programEntity.dateStart = dateStart;
    programEntity.dateFinal = dateFinal;
    programEntity.status = status;

    try {
      const foundProgram = await programRepo.findOne({ where: { numberUnique: programEntity.numberUnique } });

      if (foundProgram) {
        programEntity = foundProgram;
        console.log(`Id: ` + foundProgram.programId);
        programEntity.programId = foundProgram.programId; // NOTE: required for the association
        console.log(`Old. Program ${programEntity.programId} already exists.`);
      }

      if (foundProgram === null) {
        await programRepo.save(programEntity); // TODO: If not found, save program
      }

    } catch (error: any) {
      console.log(`Error on (Program): ${error.message}`);
    }

    // NOTE: reduced attributs output for better visualization
    // console.log(programEntity.title?.substring(0, 50));
    // console.log(programEntity.summary?.substring(0, 50));
    // console.log(programEntity.objectives?.substring(0, 50));
    // console.log(programEntity.defense?.substring(0, 50));
    // console.log(programEntity.results?.substring(0, 50));

    // TODO: program inspections
    // console.log(program); 
    // console.log(programPanelDataInspector);
    // console.log(programClassificInspector);
    // console.log(programSituationInspector);
    // console.log(memberAttributesInspector);
    // console.log(memberAcademicRole);

    // TODO: section of keywords persistence

    let keywords: string[] = await page.$$eval('div.span3 > span', (keys: any) => {
      return [
        keys[5].innerText,
        keys[7].innerText,
        keys[9].innerText,
        keys[11].innerText,
      ];
    });

    for (const keyword of keywords) {

      let keywordEntity: KeywordEntity = { keywordName: keyword };
      let foundKeyword: KeywordEntity | null = null;

      try {
        foundKeyword = await keywordRepo.findOne({ where: { keywordName: keyword } });
      } catch (error: any) {
        console.log('Find keyword error');
      }

      try {
        if (foundKeyword === null) {
          // console.log(`Didnt exists ${keywordEntity.keywordName}`);
          await keywordRepo.save(keywordEntity); // NOTE: not found, then save to database
        }
      } catch (error: any) {
        console.log('Save keyword error');
      }

      const program_to_keyword = new ProgramToKeyword();
      program_to_keyword.program = programEntity;
      program_to_keyword.keyword = keywordEntity; // NOTE: association begin

      if (foundKeyword) {
        // console.log(`Already exist '${keywordEntity.keywordName}'`);
        program_to_keyword.keyword = foundKeyword; // NOTE: If found, uses existing keyword from mapping table.
      }

      // TODO: does an association already exists
      const foundAssociation = await programToKeywordRepo.findOne({ where: { program: programEntity, keyword: keywordEntity } });

      if (foundAssociation) {
        console.log(`Old. Association of program ${programEntity.programId} and keyword ${foundKeyword?.keywordId} already exists.`);
        continue; // TODO: Alredy exists. Goes to next iteration.
      }

      try {
        await programToKeywordRepo.save(program_to_keyword); // TODO: save keyword to program        
      } catch (error: any) {
        console.log(`Error saving association: ${error.message}`);
      }
    }

    // TODO: keywords of programs
    // const keys = `${' '.repeat(6)}╰─── ${JSON.stringify([...keywords])}`;
    // console.log(`Keywords: `)
    // console.log(keys);

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
        // console.log(`Regions: `);
        // console.log(`${' '.repeat(6)}╰───`, ['Not informed']);
        break;
      }

      // NOTE: The third column contains the addresses 
      if (datas.indexOf(datas[i]) >= 3) {
        // console.log(`Regions: `);
        // console.log(`${' '.repeat(6)}╰───`, JSON.stringify(datas[i].split('\t')));
        const addressesSplitted: string[] = datas[i].split('\t');
        cities.push(addressesSplitted[0]); // NOTE: collect cities 
        states.push(addressesSplitted[1]); // NOTE: collect states
      }
    }

    // TODO: section of address persistence

    for (let i = 0; (cities.length === 0) || (i < cities.length); ++i) {

      let addressEntity: AddressEntity = { };

      if (cities.length === 0) {
        // console.log(`Found ${cities.length} addresses. Next step.`);
        break;
      }

      addressEntity.city = cities[i];
      addressEntity.state = states[i];
      addressEntity.campus = getCampusFromCity(addressEntity.city) ?? undefined;
     
      let foundAddress;

      try {
        foundAddress = await addressRepo.findOne({ where: { city: addressEntity.city, state: addressEntity.state, campus: addressEntity.campus } });
      } catch (error: any) {
        console.log(`FAIL: finding address ` + error.message);
      }
      
      try {
        if (foundAddress === null) {
          console.log(`INFO: didn't exist (address)`);
          await addressRepo.save(addressEntity); // NOTE: not found, then save to database
        }
      } catch (error: any) {        
        console.log(`FAIL: saving address ` + error.message);
      }

      const programToAddress = new ProgramToAddress();
      programToAddress.program = programEntity;
      programToAddress.address = addressEntity;

      if (foundAddress !== null) {
        // console.log(`Found ` + JSON.stringify(foundAddress).substring(0, 80));
        programToAddress.address = foundAddress; // NOTE: If found, uses existing keyword from mapping table.
      }

      // TODO: these found associations could also be wrapped with a try catch block
      const foundAssociation = await programToAddressRepo.findOne({ where: { program: programEntity, address: addressEntity } }); 

      if (foundAssociation) {
        console.log(`Old. Association of program ${programEntity.programId} and address ${foundAddress?.addressId} already exists.`);
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

        await setTimeout(500); // NOTE: timeout is required for asynchronous modal opening
        console.log(`"Button ${detalhesButtons.indexOf(button)}"`); // NOTE: debugging

        try {
          await button.click(); /// TODO: open the modal
        } catch (error: any) {
          fail('Failure on modal open: ' + error.message);
        }

        try {
          let closeButtons: any = null;
          let lastCloseButton: any = null;

          while (lastCloseButton === null || lastCloseButton === undefined || !(await lastCloseButton.isIntersectingViewport())) {
            closeButtons = await page.$$('.close');
            const lastIndex: number = closeButtons.length - 1;
            lastCloseButton = closeButtons[lastIndex];
          }

          await lastCloseButton.click();  // TODO: close the modal
        } catch (error: any) {
          fail('Button (Close): ' + error.message);
        }
      }

      // TODO: section of member persistence (after all buttons were clicked)

      let members: MemberDto[] = await getMemberFromModal(page);

      for (const member of members) {

        let memberEntity: MemberEntity = { };
        memberEntity.name = member.name;
        memberEntity.matricula = member?.matricula;
        memberEntity.vinculo = member.vinculo;
        memberEntity.vinculoStatus = member.vinculoStatus;
        memberEntity.email = member.email;
        memberEntity.imageSource = member.imageSource;
        memberEntity.lotacaoExercicio = member.lotacaoExercicio;
        memberEntity.lotacaoOficial = member.lotacaoOficial;
        memberEntity.curso = member.curso;

        let foundMember: any;

        try {
          foundMember = await memberRepo.findOne({ where: { matricula: memberEntity.matricula ?? undefined }}) ;
        } catch (error: any) {
          console.log(error);
        }

        // NOTE: must be here for debugging 
        console.log(`${members.indexOf(member) + 1} ${JSON.stringify(member.name)} ${member.memberRole}`);

        try {
          if (foundMember === null) {
            memberEntity = await memberRepo.save(memberEntity); // NOTE: not found, then save to database
            console.log(`""Saved (Member): ` + JSON.stringify(memberEntity).substring(0, 80));
          }
        } catch (error: any) {        
          // ERROR HERE
          console.log(`""(Error): saving member ::: ${error}${'\n(Error message): '}` + error.message);
        }

        // TODO: build relation after found association
        const programToMember = new ProgramToMember();
        programToMember.program = programEntity;
        programToMember.member = memberEntity;
        
        // TODO: relational data on program to member
        programToMember.memberRole = member.memberRole;
        programToMember.cargaHoraria = member.cargaHoraria;
        programToMember.periodo = member.periodo;
        programToMember.recebeBolsa = member.recebeBolsa;
        programToMember.bolsa = member.bolsa;
        programToMember.valor = member.valor;

        if (foundMember !== null) {
          // console.log(`Found ` + JSON.stringify(foundAddress).substring(0, 80));
          memberEntity = foundMember;
          programToMember.member = foundMember; // NOTE: If found, uses existing keyword from mapping table.
        }

        const foundAssociation = await programToMemberRepo.findOne({ where: { program: programEntity, member: memberEntity, memberRole: member.memberRole ?? undefined } }); 
        // console.log(`Verify: ` + JSON.stringify(programToMember)); // TODO: debugging
        console.log(`Has association ${foundAssociation?.member?.memberId}`);

        if (foundMember) {
          // console.log(`""Found (Member): ` + JSON.stringify(foundMember).substring(0, 80));
          programToMember.member = foundMember; // NOTE: If found, uses existing keyword from mapping table.
        }

        try {
          if (foundAssociation === null) {
            // console.log(`""(Saved) association of program ${programEntity.programId} and member ${foundMember?.memberId} created.`)
            await programToMemberRepo.save(programToMember);
          } else {
            console.log(`""Already exists. Association of program ${programEntity.programId} and member ${foundMember?.memberId}`);
          }
        } catch (error: any) {
          // ERROR HERE
          console.log(`""(Error) associating member ::: ${error}${'\n(Error message): '}` + error.message);
        }

      }
      
      // TODO: jump to next tab of members
      const nextTabsLink: ElementHandle<Element> | null = await page.$('li a[title="Próxima página"]');

      if (nextTabsLink == null) {        
        warn('" NULL Break to the next URL"'); // NOTE: debugging
        console.log('-'.repeat(100)); // NOTE: Division for better visual debugging.
        break;
      }
      
      // NOTE: Go to next tab
      if (nextTabsLink && tabPointer >= 1 && nextTabsLink) {
        warn(`"Has next tab" ${tabPointer}`); // NOTE: debugging
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

async function getMemberFromModal(page: Page): Promise<MemberDto[]> {

  const deadModals: ElementHandle<Element>[] = await page.$$('.modaljs-scroll-overlay');
  const members: MemberDto[] = [];

  for (const modal of deadModals) {

    let member: MemberDto = {
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
      member.imageSource = base64Image; // NOTE: temporarely
      // console.log(base64Image.substring(0, 99));
    } catch (error: unknown) {
      member.imageSource = null; // NOTE: It's an icon tag
    }

    for (const p of paragraphs) {

      const text: string = await p.evaluate((el: any) => el.innerText);
      let [key, value]: string[] = text.split(':');

      if (value) {
        value = value.substring(1, value.length); // TODO: Ignore the first character at postiion '0'
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
          member.name = key.trim(); // TODO: unknown key is the 'name' attribute
          break;
      }

      // TODO: debugging
      // if (paragraphs.indexOf(p) > 0) {
      //   // TODO: add to set
      //   memberAttributesInspector.add(getKey(text));

      //   // NOTE: inspect keys and values
      //   // console.log(`index: ${paragraphs.indexOf(p)} key: ${key}, val: ${value}`);

      //   if (key === 'Função no projeto') {
      //     memberAcademicRole.add(value);
      //   }
      // }
    }

    // TODO: debugging
    // console.log(member); // NOTE: maintain

    members.push(member);
  }

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

// TODO: main function starts the program

main().catch((error: unknown) => { 
  console.log(error); // TODO: Handle error here
});