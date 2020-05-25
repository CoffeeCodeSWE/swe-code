const fs = require('fs');
const Papa = require('papaparse');
const {ipcRenderer} = require('electron');
const $ = require('jquery');
require('popper.js');
let unpackedData = null;
let oldData = null;

const Controller = require('./js/controller.js');
const Model = require('./js/model.js');
const View = require('./js/view.js');


$(document).ready(() => {
  const app = new Controller(new Model(), new View());

/*
  fileInput.change((e) => {
    handleCSVFile(path);
  });
  predCheck.change(() => {
    predCheck.prop('checked') ? predInput.removeAttr('hidden') : predInput.attr('hidden', 'hidden');
  });
  predInput.change((e) => {
    fs.readFile(e.target.files[0].path, (err, data) => {
      data = data.replace(/\r?\n|\r/g, '\n');
      let predJson = JSON.parse(data);
      oldData = {};
      $('#notes').val(predJson.notes);
      oldData.creators = predJson.creators;
      oldData.timestamps = predJson.timestamps;

    });
  });

  $('#select-target').on('change', () => {
    $('input').show();
    $('label').show();
    let selectedValue = $('option:selected').text();
    $('input[id="' + selectedValue + '"]').hide();
    $('label:contains("' + selectedValue + '")').hide();

  });

  $('#training-form').submit((e) => {
    e.preventDefault();

    let notes = $('#notes').val();

    let model = $('input:radio').val();
    if (model.toLowerCase() === 'rl') {
      ipcRenderer.send('model:rl', [getRLParams(), notes, oldData]);
    } else {
      alert('NOT IMPLEMENTED');
    }

  });

  let openBtt = $('#open-chart');

  openBtt.hide();
  openBtt.click((e) => {
    e.preventDefault();
    openBtt.hide();
    ipcRenderer.send('request-chart:update', unpackedData);
  });
  ipcRenderer.on('chart:closed', () => {
    openBtt.show();
  });
*/
});
function getRLParams() {
  let selectedTarget = $('#select-target').val();
  let rlData = {};
  let selectedVars = [];
  $('input:checkbox:checked').each((ev, item) => {
    selectedVars.push(item.id);
  });
  rlData.variables = {};
  Object.keys(unpackedData).forEach((k) => {
    if (selectedVars.includes(k) && k !== selectedTarget) {
      rlData.variables[k] = unpackedData[k];
    }
  });

  rlData.target = {};
  rlData.target[selectedTarget] = unpackedData[selectedTarget];
  return rlData;
}

function handleCSVFile(path) {
  fs.readFile(path, (err, data) => {
    $('#open-chart').hide();
    if (err) {
      console.log('error');
    } else {
      let jsonData = convertCSVtoJSON(data);

      ipcRenderer.send('request-chart:update', jsonData);

      updateFormFields(jsonData);
      unpackedData = jsonData;
    }
  });
}

function convertCSVtoJSON(data) {
}

function updateFormFields(data) {
  $('#content').removeAttr('hidden');

  let selectVars = $('#select-vars');
  selectVars.html('');
  let selectTarget = $('#select-target');
  selectTarget.html('<option hidden disabled selected value> -- select an option --</option>');

  Object.keys(data).forEach((k) => {
    addVarCheckbox(k, selectVars);

    let optionElem = $('<option></option>', {text: k, value: k});
    selectTarget.append(optionElem);
  });
}

function addVarCheckbox(key, selectVars) {
  let divElem = $('<div></div>', {class: 'form-check'});
  let inputElem = $('<input />', {id: key, type: 'checkbox', class: 'form-check-input'/*, checked: 'checked'*/});
  let labelElem = $('<label></label>', {text: key});
  divElem.append(inputElem);
  divElem.append(labelElem);
  selectVars.append(divElem);
}
