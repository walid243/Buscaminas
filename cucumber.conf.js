const {Before, BeforeAll, AfterAll, After, setDefaultTimeout} = require('@cucumber/cucumber');
const {chromium} = require('playwright');
 
setDefaultTimeout(60000);
 
// launch the browser
BeforeAll(async () => {
  global.browser = await chromium.launch({
    headless: true,             //esto es pa qe no se vea en el navegador, pero si pones false, te lo abre en el nav y puedes ver paso a paso como va haciendo el test, pa detectar errores
    slowMo: 1,                  //si pones 1000 es 1s. Es decir, por ejemplo, en un test de poner nums, te pondra uno por segundo
  });
});
 
// close the browser
AfterAll(async () => {
  await global.browser.close();
});
 
// Create a new browser context and page per scenario
Before(async () => {
  global.context = await global.browser.newContext();
  global.page = await global.context.newPage();
});
 
// Cleanup after each scenario
After(async () => {
  await global.page.close();
  await global.context.close();
});