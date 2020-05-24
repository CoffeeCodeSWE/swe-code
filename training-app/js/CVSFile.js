const fs = require('fs');
const Papa = require('papaparse');

module.exports = class CVSFile {
  constructor(path) {
    this.path = path;
  }

  get parsedCSV() {
    return this.parsedData;
  }

  read() {
    let raw = fs.readFileSync(this.path, {flag: 'r'});
    let parsed = Papa.parse(raw.toString().replace(/\r?\n|\r/g, '\n'));

    if(parsed.errors.length !== 0) {
      throw new Error('CSV file is not well formed');
    }
    console.log(Object.keys(parsed.data));
    if(Object.keys(parsed.data).length - 1 < parsed.data[0].length) {
      throw new Error('Not enough data');
    }
    this.parsedData = parsed.data;
  }
};
