const {app, BrowserWindow, ipcMain, dialog} = require('electron');
const fs = require('fs');
const MainWindow = require('./js/main-window');

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

ipcMain.on('save', (event, args) => {
  save(JSON.stringify(args));
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
