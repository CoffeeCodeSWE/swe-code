const CSV = require('./../js/csv-file');

let csv=null;

beforeAll(() => {
  csv = new CSV("./test/csvExample.CSV");
});

test('construct', () => {

  expect(csv.path).not.toBe(null);
});

test('test of read', () => {

  csv.read();

  expect(csv.parsedData).toEqual([
    ["a","b","c","d"],
    ["1","3","4","2"],
    ["6","3","5","1"],
    ["2","5","1","7"],
    ["6","2","1","5"]
  ]);
});