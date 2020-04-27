const fs = require('fs');
const Papa = require('papaparse');
const {ipcRenderer} = require('electron');
const $ = require('jquery');
require('popper.js');
$(document).ready(() => {
  let file_input = $('#csv-file');
  file_input.change((e) => {
    let path = e.target.files[0].path;
    handleCSVFile(path);
  });
  $('#select-target').on('change', (e) => {
    $('input').prop('disabled', false);
    let selected_value = $('option:selected').text();
    $('input[id="' + selected_value + '"]').prop('disabled', true);

  });

});

function handleCSVFile(path) {
  fs.readFile(path, (err, data) => {
    if (err) {
      console.log('error');
    } else {
      let json_data = convertCSV(data);
      const ordered_data = {};
      Object.keys(json_data).sort().forEach(function (key) {
        ordered_data[key] = json_data[key];
      });
      ipcRenderer.send('request-chart:update', ordered_data);

      initInput(ordered_data);
    }
  });
}

function convertCSV(data) {

  let csv_mat = Papa.parse(data.toString()).data;
  let json_data = {};
  for (let i = 0; i < csv_mat[0].length; i++) {
    let key = csv_mat[0][i];
    json_data[key] = [];
    for (let k = 1; k < csv_mat.length; k++) {
      json_data[key].push(csv_mat[k][i]);
    }
  }
  return json_data;
}

function initInput(data) {
  $('#content').removeAttr('hidden');

  let select_vars = $('#select-vars');
  select_vars.html('');
  let select_target = $('#select-target');
  select_target.html('<option hidden disabled selected value> -- select an option --</option>');

  Object.keys(data).forEach((k) => {
    let div_elem = $('<div></div>', {class: 'form-check'});
    let input_elem = $('<input />', {id: k, type: 'checkbox', class: 'form-check-input', value: 'check'});
    let labelElem = $('<label></label>', {text: k});
    div_elem.append(input_elem);
    div_elem.append(labelElem);
    select_vars.append(div_elem);

    let option_elem = $('<option></option>', {text: k, value: k});

    select_target.append(option_elem);
  });
}
