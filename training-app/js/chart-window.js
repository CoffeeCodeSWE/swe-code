const { BrowserWindow } = require('electron');

module.exports = class ChartWindow extends BrowserWindow {
  constructor() {
    super({
      webPreferences: {
        nodeIntegration: true
      }
    });

    this.loadFile(__dirname + '/../chart.html');
  }
};
