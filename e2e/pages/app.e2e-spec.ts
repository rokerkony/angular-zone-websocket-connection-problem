import {ZoneWebsocketsPage} from '../app.po';
import {browser} from 'protractor';
import {writeScreenshot} from '../screenshot.helper';

describe('zone-websockets App', () => {
  const page: ZoneWebsocketsPage = new ZoneWebsocketsPage();

  beforeEach(() => {
    page.navigateTo();
  });

  it('should connect to websocket', () => {
    expect(page.getParagraphText()).toEqual('Welcome, result is: WRONG');
    browser.wait(() => browser.isElementPresent(page.getSpan()), 15000).then(() => {
      expect(page.getSpan().getText()).toEqual('connected');
    }, () => {
      browser.takeScreenshot().then(writeScreenshot);
      fail('Failed to connect, making screenshot');
    });
  });
});
