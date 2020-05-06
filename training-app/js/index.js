const fs = require('fs');
const Papa = require('papaparse');
const {ipcRenderer} = require('electron');
const $ = require('jquery');
require('popper.js');
let unpackedData = null;
let oldData = null;

$(document).ready(() => {
  let fileInput = $('#csv-file');
  let predInput = $('#pred-file');
  let predCheck = $('#have-pred');
  fileInput.change((e) => {
    let path = e.target.files[0].path;
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
    let selectedTarget = $('#select-target').val();
    let rlData = {};
    let selectedVars = [];
    let notes = $('#notes').val();
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


    let model = $('input:radio').val();

    if (model.toLowerCase() === 'rl') {
      ipcRenderer.send('model:rl', [rlData, notes, oldData]);
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
});


function handleCSVFile(path) {
  fs.readFile(path, (err, data) => {
    let openBtt = $('#open-chart');
    openBtt.hide();
    if (err) {
      console.log('error');
    } else {
      let jsonData = convertCSV(data);
      const orderedData = {};
      Object.keys(jsonData).sort().forEach(function (key) {
        orderedData[key] = jsonData[key];
      });
      ipcRenderer.send('request-chart:update', orderedData);

      initInput(orderedData);
      unpackedData = orderedData;
    }
  });
}

function convertCSV(data) {

  let csvMat = Papa.parse(data.toString()).data;
  let jsonData = {};
  for (let i = 0; i < csvMat[0].length; i++) {
    let key = csvMat[0][i];
    jsonData[key] = [];
    for (let k = 1; k < csvMat.length; k++) {
      jsonData[key].push(csvMat[k][i]);
    }
  }
  return jsonData;
}

function initInput(data) {
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
