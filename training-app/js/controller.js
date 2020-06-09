const { getCurrentWindow } = require('electron');

module.exports = class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    this.view.bindFileChange(this.handleFileChanged);
    this.view.bindFormSubmit(this.handleFormSubmit);
    this.view.bindLoadPredictor(this.handleLoadPredictor);
    this.view.bindRlLine(this.handleRlLine);
  }

  handleFileChanged = (path) => {

    this.view.reset();

    try {
      this.model.readFromCVS(path);
      this.view.buildPage(this.model.json);
    } catch (e) {
        this.view.showError(e.message);
        this.view.reset();
    }
  }

  handleFormSubmit = (keys, meta) => {
    let data = this.model.getDataByFilter(keys);
    this.model.savePredictor(this.model.calculatePredictor(data, meta));
  }

  handleLoadPredictor = (path) => {
    this.model.loadPredictor(path);

    this.view.setNotes(this.model.notes);
  }

  handleRlLine = (keys, meta) => {
    console.log(keys)
    let data = this.model.getDataByFilter(keys);
    console.log(data);
    let coeff = this.model.calculatePredictor(data, meta);
    console.log(2222);
    let k = (Object.keys(data.variables)[0]);
    let arr = Array.from(data.variables[k], x => +x);
    console.log((arr));
    this.view.addRlLine(coeff, Math.min(...arr), Math.max(...arr));
  }

};
