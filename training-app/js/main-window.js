const { BrowserWindow } = require('electron');

module.exports = class MainWindow extends BrowserWindow {
  constructor() {
    super({
      webPreferences: {
        nodeIntegration: true
      }
    });
    this.loadFile(__dirname + '/../index.html');
  }
};
