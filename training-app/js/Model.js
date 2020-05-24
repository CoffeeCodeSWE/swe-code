
const CVSFile = require('./CVSFile.js');
const JSONFile = require('./JSONFile.js');

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
};
