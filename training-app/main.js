const {app, BrowserWindow, ipcMain, dialog} = require('electron');
const fs  = require('fs');
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
    chartWindow.webContents.once('did-finish-load', () => {
      chartWindow.webContents.send('chart:update', data);

    });
  } else {
    chartWindow.webContents.send('chart:update', data);
  }


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

ipcMain.on('model:rl', (event, data) => {
  console.log(data);
  let reg = rlFromScratch(data);
  let coefficients = reg.calculateCoefficients();

  let keys = Object.keys(data.variables);

  let output = {};
  let predictor = {};
  predictor.tuples = data.variables[keys[0]].length;
  predictor.coefficents = {};
  let i = 1;
  keys.forEach((k) => {
    predictor.coefficents[k] = coefficients[i][0];
    i++;
  });
  predictor.intercept = coefficients[0][0];
  predictor.target = data.target;

  output.type = 'RL';
  output.predictor = predictor;
  let final_data = (JSON.stringify(output));
  //calcolare reg lineare dato data(il file json in entrata)
  //sputare fuori l'output in una variabile

  dialog.showSaveDialog().then((filename) => {
    if(filename === undefined) {
      console.log('error');
    }
    fs.writeFile(filename.filePath, final_data, (err) => {
      if(err) {
        console.log(err);
      } else {
        console.log('OK');
      }
    });
  });
});
