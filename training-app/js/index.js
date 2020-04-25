const fs = require('fs');
const Papa = require('papaparse');
const { ipcRenderer } = require('electron');

function handleCSVFile(path) {

  fs.readFile(path, (err, data) => {
    if(err) {
      alert('error');
    } else {
      let csv_mat = Papa.parse(data.toString()).data;
      console.log(csv_mat);
      let json_data = {};
      for (let i = 0; i < csv_mat[0].length; i++) {
        let key = csv_mat[0][i];
        json_data[key] = [];
        for (let k = 1; k < csv_mat.length; k++) {
          json_data[key].push(csv_mat[k][i]);
        }
      }

      ipcRenderer.send('request-chart:update', json_data);
    }


  });

}

let file_input = document.getElementById('cvs-file');
file_input.addEventListener('change', () => {

  let path = file_input.files[0].path;
  handleCSVFile(path);

});
