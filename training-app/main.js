
const { app, BrowserWindow, ipcMain } = require('electron');
const MainWindow = require('./js/main-window');
const { ChartWindow } = require('./js/chart-window');

let mainWindow = null;
let chartWindow = null;

function main() {
  mainWindow = new MainWindow();
}

ipcMain.on('request-chart:update', (event, data) => {
  if(chartWindow === null) {
    chartWindow = new ChartWindow();
  }

  chartWindow.webContents.send('chart:update', data);
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
