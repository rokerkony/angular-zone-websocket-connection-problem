'use strict';

/* tslint:disable:no-require-imports no-var-requires */
const fs: any = require('fs');
const path: any = require('path');
/* tslint:enable */

const defaultExtension: string = '.png';
const defaultFolder: string = 'e2e/tmp';

/**
 * Usage:
 *     browser.takeScreenshot().then(writeScreenshot);
 *     or
 *     browser.takeScreenshot().then((data: any): void => writeScreenshot(data, 'my-prefix-', 'my-filename', 'special-folder'));
 *
 * @param {Stream} data
 * @param {string=} filenamePrefix
 * @param {string=} filename
 * @param {string=} folder
 *
 * @returns {void}
 */
export function writeScreenshot (data: any, filenamePrefix: string = '', filename?: string, folder?: string): void {
    filename = filenamePrefix + (filename || getFilename());
    folder = folder || defaultFolder;

    const stream: any = fs.createWriteStream(path.join(folder, filename));
    stream.write(new Buffer(data, 'base64'));
    stream.on('error', (err) => {
      console.log('Could not create an screenshot! Maybe the folder you want to write to is not existing. Reason: ', err.toString());
      stream.end();
    });
    stream.end();
}

function getFilename (): string {
    return `${(new Date()).toISOString()}_${Math.round(Math.random() * 1000)}${defaultExtension}`;
}
