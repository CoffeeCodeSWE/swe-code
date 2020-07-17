/*
* File: csvFile.test.js
* Version: 
* Date: 2020-07-03
* Author: CoffeeCode <coffeecodeswe@gmail.com>
* Description: File con i test riguardanti la classe CSVFile
* Remarks:
*/

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

test('test of parsedCSV', () => {
  expect(csv.parsedCSV).toEqual([
    ["a","b","c","d"],
    ["1","3","4","2"],
    ["6","3","5","1"],
    ["2","5","1","7"],
    ["6","2","1","5"]
  ]);
});