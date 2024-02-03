import { launch } from 'puppeteer';
import { now } from '../src/utils/time.js';
import { fail, done, info, warn } from '../src/utils/todo.js'


const URL_TEMPLATE = "https://portal.ufsm.br/projetos/publico/projetos/view.html?idProjeto=%d";
let onStart;

const start = () => {
  onStart = new Date().toLocaleString();
  console.log('\nSOUP: Program started on', onStart);
};

const close = () => {
  console.log('\nProgram finished...', onStart, '\n');
};

const onClose = (runnable) => {
  process.on('exit', runnable);
  process.on('SIGINT', runnable);
};

const crawl = async (startId) => {
  const browser = await launch({ headless: true });

  onClose(() => {
    console.log('Closing browser...');
    browser.close();
    close();
  });

  for (let numb = startId; numb > 0; numb--) {
    console.log('-'.repeat((10 * 10 * 10) / 5));

    const url = URL_TEMPLATE.replace('%d', numb);
    const page = await browser.newPage();

    try {
      const response = await page.goto(url, { waitUntil: 'domcontentloaded' });
      if (!response.ok()) {
        console.error(`Failed to load page: ${url}`);
        continue;
      }

      console.log('Found PageId:', numb);

      const forbidden = await page.evaluate(() => {
        const confidential = document.querySelector('.label.pill.error')?.innerText === 'Este é um projeto confidencial';
        return confidential;
      });

      if (forbidden) {
        console.error('Confidential Project:', url);
        continue;
      }

      console.log('Visiting URL:', url, ', Title:', await page.title());

      const classification = await page.$eval('div.span6 > span:nth-child(5)', el => el.textContent);
      const status = await page.$eval('div.span6 > span:nth-child(15)', el => el.textContent);

      console.log(classification);
      console.log(status);

      // Rest of your code...

    } catch (error) {
      console.error(error.message);
    } finally {
      await page.close();
    }
  }

  console.log('Crawling completed.');
};

start();
crawl(74584);
