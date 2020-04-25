const { ipcRenderer } = require('electron');
require('chart.js');

ipcRenderer.on('chart:update', (event, args) => {
  console.log(args);
  //call function to render data
});
