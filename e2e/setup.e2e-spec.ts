import {browser} from 'protractor';

beforeEach(() => { // this is hack to fix `window.angular is undefined`
  browser.ignoreSynchronization = true;
  browser.waitForAngularEnabled();
  browser.waitForAngular();
  browser.sleep(1000);
});
