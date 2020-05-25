const {BrowserWindow} = require('electron');

module.exports = class MainWindow extends BrowserWindow {
  constructor() {
    super({
      width: 1200,
      height: 900,
      webPreferences: {
        nodeIntegration: true
      }
    });
    this.loadFile(__dirname + '/../index.html');
  }
};
