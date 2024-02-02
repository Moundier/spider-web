const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto("https://portal.ufsm.br/projetos/publico/projetos/view.html?idProjeto=74584");

  const html = await get_html(page);
  // console.log(html);
  

  // click all buttons of current page
  // if buttons are null (ended)
  // see if there is more tabs (more buttons, more participants)
  // if so click
  // else fetch new loaded buttons and repeat until tabs end and buttons end


  // THEN get all appended dead modaljs-popups

  const buttonInnerTexts = await page.$$eval('.btn.detalhes', buttons => {
    return buttons.map(button => button.innerText.trim());
  });

  const spanNames = await page.$$eval('', names => {

    

    return names.map(name => name.innerText.trim());
  });

  console.log('Button Inner Texts:', buttonInnerTexts);

  await browser.close();
})();

async function get_html(page) {
  return await page.content();
}
