const fs = require('fs');
const Papa = require('papaparse');
const {ipcRenderer} = require('electron');
const $ = require('jquery');
require('popper.js');


const Controller = require('./js/controller.js');
const Model = require('./js/model.js');
const View = require('./js/view.js');


$(document).ready(() => {
  const app = new Controller(new Model(), new View());
});
