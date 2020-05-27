const {app, BrowserWindow, ipcMain, dialog} = require('electron');
const fs = require('fs');
const helper = require('./js/helper');
const MainWindow = require('./js/main-window');
const {rlFromScratch} = require('./js/RL-calculate');

let mainWindow = null;

function main() {
  mainWindow = new MainWindow();
  mainWindow.on('close', () => {
    app.exit();
  });
}

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

  let finalData = (JSON.stringify(output, null, 2));

  save(finalData);
});

function save(finalData) {
  dialog.showSaveDialog(mainWindow).then((filename) => {
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
