const {InvalidCSVFile} = require('./errors');
const { getCurrentWindow } = require('electron');

module.exports = class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    this.view.bindFileChange(this.handleFileChanged);
    this.view.bindFormSubmit(this.handleFormSubmit);
    this.view.bindLoadPredictor(this.handleLoadPredictor);
  }

  handleFileChanged = (path) => {
    try {
      this.model.readFromCVS(path);
      this.view.buildPage(this.model.json);
    } catch (e) {
        this.view.showError(e.message);
        this.view.reset();
    }
  }

  handleFormSubmit = (data) => {
    let d = this.model.getDataByFilter(data);
  }

  handleLoadPredictor = (path) => {
    this.model.loadPredictor(path);

    this.view.setNotes(this.model.notes);
  }

};
