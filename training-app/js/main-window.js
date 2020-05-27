const {BrowserWindow} = require('electron');

module.exports = class MainWindow extends BrowserWindow {
  constructor() {
    super({
      width: 1300,
      height: 840,
      webPreferences: {
        nodeIntegration: true
      }
    });
    this.loadFile(__dirname + '/../index.html');
  }
};
