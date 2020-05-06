const {app, BrowserWindow, ipcMain, dialog} = require('electron');
const fs = require('fs');
const helper = require('./js/helper');
const MainWindow = require('./js/main-window');
const ChartWindow = require('./js/chart-window');
const {rlFromScratch} = require('./js/RL-calculate');

let mainWindow = null;
let chartWindow = null;

function main() {
  mainWindow = new MainWindow();
  mainWindow.on('close', () => {
    app.exit();
  });
}

ipcMain.on('request-chart:update', (event, data) => {
  if (chartWindow === null) {
    chartWindow = new ChartWindow();
    chartWindow.on('close', () => {
      chartWindow = null;
      mainWindow.webContents.send('chart:closed');
    });
  }
  chartWindow.webContents.once('did-finish-load', () => {
    chartWindow.webContents.send('chart:update', data);

  });
});

app.whenReady().then(main);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    mainWindow = null;
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    main();
  }
});

ipcMain.on('model:rl', (event, args) => {
  let data = args[0];
  let notes = args[1];
  let oldData = args[2];

  let reg = rlFromScratch(data);
  let coefficients = reg.calculateCoefficients();


  let output = helper.generateRLOutput(data, coefficients);
  helper.addMeta(output, notes, oldData);

  let finalData = (JSON.stringify(output));

  save(finalData);
});

function save(finalData) {
  dialog.showSaveDialog().then((filename) => {
    if (filename === undefined) {
      console.log('error');
      return;
    }
    fs.writeFile(filename.filePath, finalData, (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log('OK');
      }
    });
  });

}
