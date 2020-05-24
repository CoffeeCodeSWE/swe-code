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

  Object.keys(data).forEach((k) => {
    addVarCheckbox(k, selectVars);


  });
}

function addVarCheckbox(key, selectVars) {

}
