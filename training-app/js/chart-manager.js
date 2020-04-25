const { ipcRenderer } = require('electron');
require('chart.js');

ipcRenderer.on('chart:update', (event, args) => {
  //call function to render data
});
