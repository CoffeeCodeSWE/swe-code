const {BrowserWindow} = require('electron');

module.exports = class MainWindow extends BrowserWindow {
  constructor() {
    super({
      width: 580,
      height: 800,
      webPreferences: {
        nodeIntegration: true
      }
    });
    this.loadFile(__dirname + '/../index.html');
    this.setPosition(1000,200);
  }
};
