const CVSFile = require('./csv-file.js');
const JSONFile = require('./json-file.js');
const {ipcRenderer} = require('electron');
const RLadapter = require('./rl-adapter');
const SVMadapter = require('./svm-adapter');

module.exports = class Model {
  constructor() {
  }

  readFromCVS(path) {
    this.cvsFile = new CVSFile(path);
    this.cvsFile.read();
    this.convertCVStoJSON();

  }

  convertCVStoJSON() {
    this.jsonFile = JSONFile.fromCVS(this.cvsFile.parsedCSV);
  }

  getDataByFilter(param) {
    return this.jsonFile.filterAndGroup(param);
  }

  loadPredictor(path) {
    this.predictor = JSONFile.fromPath(path);
  }

  get notes() {
    return this.predictor.json.notes;
  }

  get json() {
    return this.jsonFile.json;
  }

  calculatePredictor(data, meta) {
    let adapter;
    if(meta.model === 'rl')
      adapter = new RLadapter(data);
    else
      adapter = new SVMadapter();

    let pred = adapter.executeTraining(data);

    let output = {};
    output.type = meta.model;
    output.predictor = pred;

    output.notes = meta.notes;

    return output;
  }

  savePredictor(pred){
    ipcRenderer.send('save', pred);
  }
};
