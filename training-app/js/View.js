const $ = require('jquery');
const Swal = require('sweetalert2');

module.exports = class View {
  constructor() {
    this.fileInput = $('#csv-file');
    this.predInput = $('#pred-file');
    this.predCheck = $('#have-pred');
    this.selectVars = $('#select-vars');
    this.selectTarget = $('#select-target');
    this.content = $('#content');
    this.trainingForm = $('#training-form');
    this.notesInput = $('#notes');

    this.predCheck.change((e) => {
      if(e.target.checked) {
        this.predInput.removeAttr('hidden');
      } else {
        this.predInput.attr('hidden', 'hidden');
      }
    });
  }

  bindFileChange(handler) {
    this.fileInput.change((e) => {
      let path = e.target.files[0].path;
      handler(path);
    });
  }

  bindLoadPredictor(handler) {
    this.predInput.change((e) => {
      let path = e.target.files[0].path;
      handler(path);
    });

  }

  bindFormSubmit(handler) {
    this.trainingForm.submit((e) => {
      e.preventDefault();

      let data = {
        variables: this.getVars(),
        target: this.getTarget()
      };

      if(data.variables.includes(data.target)) {
        this.showError('Target cannot be in variables list');
        return;
      }

      let meta = {

      }

      handler(data);
    });
  }

  buildPage(json) {
    this.json = json;

    this.initSelectTarget(json);
    this.initVars(json);

    this.showContent();
  }

  showContent() {
    this.content.removeAttr('hidden');
  }

  hideContent() {
    this.content.attr('hidden', 'hidden');
  }

  initSelectTarget(json) {
    this.selectTarget.html('<option hidden disabled selected value> -- select an option --</option>');

    Object.keys(json).forEach((k) => {
      this.addTarget(k);
    });
  }

  initVars(json) {
    Object.keys(json).forEach((k) => {
      this.addVar(k);
    });
  }

  addVar(key) {
    let divElem = $('<div></div>', {class: 'form-check'});
    let inputElem = $('<input />', {id: key, type: 'checkbox', class: 'form-check-input'});
    let labelElem = $('<label></label>', {text: key, for: key});
    divElem.append(inputElem);
    divElem.append(labelElem);
    this.selectVars.append(divElem);
  }

  addTarget(key) {
    let optionElem = $('<option></option>', {text: key, value: key});
    this.selectTarget.append(optionElem);
  }

  getTarget() {
    return this.selectTarget.val();
  }

  getVars() {
    let vars = [];

    $('#select-vars input:checkbox:checked').each((e, item) => {
      vars.push(item.id);
    });
    return vars;
  }

  setNotes(notes) {

    this.notesInput.text(notes);
  }

  showError(message) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: message,
    });
  }


  reset() {
    this.hideContent();
    this.selectVars.html('');
    this.selectTarget.html('');
  }

};
