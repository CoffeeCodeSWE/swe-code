const fs = require('fs');

module.exports = class JSONFile {
  constructor(json) {
    this.data = json;
  }

  get json() {
    return this.data;
  }

  filterAndGroup(param) {
    let result = {};
    result.variables = {};
    result.target = {};
    param.variables.forEach((k) => {
      result.variables[k] = this.json[k];
    });

    result.target[param.target] = this.json[param.target];

    return result;
  }
  static fromPath(path) {
    let raw = fs.readFileSync(path, {flag: 'r'});
    return new JSONFile(JSON.parse(raw.toString()));
  }
  static fromCVS(csv) {
    let jsonData = {};
    for (let i = 0; i < csv[0].length; i++) {
      let key = csv[0][i];
      jsonData[key] = [];
      for (let k = 1; k < csv.length; k++) {
        jsonData[key].push(csv[k][i]);
      }
    }
    const orderedData = {};
    Object.keys(jsonData).sort().forEach(function (key) {
      orderedData[key] = jsonData[key];
    });
    return new JSONFile(orderedData);
  }

};
