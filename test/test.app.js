const puppeteer = require('puppeteer');

// NOTE: You made me happy, Puppeteer!

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const url = 'https://portal.ufsm.br/projetos/publico/projetos/view.html?idProjeto=74584';
  await page.goto(url);

  // Wait for the data to be rendered
  await page.waitForSelector('tbody tr[data-role="tableRow"]');

  // Extract data from the first tbody
  const data = await page.evaluate(() => {
    const firstTbody = document.querySelector('tbody:first-of-type');
    const rows = Array.from(firstTbody.querySelectorAll('tr[data-role="tableRow"]'));

    return rows.map(row => {
      const cells = row.querySelectorAll('td');

      return {
        participanteId: cells[1] ? cells[1].textContent.trim() : 'N/A',
        participanteNome: cells[2] ? cells[2].textContent.trim() : 'N/A',
        funcao: cells[3] ? cells[3].querySelector('.pill').textContent.trim() : 'N/A',
        horasSemana: cells[4] ? cells[4].textContent.trim() : 'N/A',
        dataFinal: cells[5] ? cells[5].querySelector('.dataFinal').textContent.trim() : 'N/A',
      };
    });
  });

  console.log(data);

  await browser.close();
})();
