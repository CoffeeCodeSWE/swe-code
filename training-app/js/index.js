const fs = require('fs');
const Papa = require('papaparse');
const {ipcRenderer} = require('electron');
const $ = require('jquery');
require('popper.js');
let unpacked_data = null;

$(document).ready(() => {
  let file_input = $('#csv-file');
  file_input.change((e) => {
    let path = e.target.files[0].path;
    handleCSVFile(path);
  });

  $('#select-target').on('change', () => {
    $('input').show();
    $('label').show();
    let selected_value = $('option:selected').text();
    $('input[id="' + selected_value + '"]').hide();
    $('label:contains("' + selected_value + '")').hide();

  });

  $('#training-form').submit((e) => {
    e.preventDefault();
    let selected_target = $('#select-target').val();
    let rl_data = {};
    let selected_vars = [];

    $('input:checkbox:checked').each((ev, item) =>{ selected_vars.push(item.id); });
    rl_data.variables = {};
    Object.keys(unpacked_data).forEach((k) => {
      if(selected_vars.includes(k) && k !== selected_target) {
        rl_data.variables[k] = unpacked_data[k];
      }
    });

    rl_data.target = {};
    rl_data.target[selected_target] = unpacked_data[selected_target];


    let model = $('input:radio').val();

    if(model.toLowerCase() === 'rl') {
      ipcRenderer.send('model:rl', rl_data);
    } else {
      alert('NOT IMPLEMENTED');
    }
  });

  let open_btt = $('#open-chart');

  open_btt.hide();

  open_btt.click((e) => {
    e.preventDefault();
    open_btt.hide();
    ipcRenderer.send('request-chart:update', unpacked_data);
  });
  ipcRenderer.on('chart:closed', () => {
    open_btt.show();
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
      unpacked_data = ordered_data;
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
    addVarCheckbox(k, select_vars);

    let option_elem = $('<option></option>', {text: k, value: k});
    select_target.append(option_elem);
  });
}
function addVarCheckbox(key, select_vars) {
  let div_elem = $('<div></div>', {class: 'form-check'});
  let input_elem = $('<input />', {id: key, type: 'checkbox', class: 'form-check-input'/*, checked: 'checked'*/});
  let labelElem = $('<label></label>', {text: key});
  div_elem.append(input_elem);
  div_elem.append(labelElem);
  select_vars.append(div_elem);
}
