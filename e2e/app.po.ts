import { browser, by, element } from 'protractor';

export class ZoneWebsocketsPage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('app-root h1')).getText();
  }

  getSpan() {
    return element(by.css('span'));
  }
}
