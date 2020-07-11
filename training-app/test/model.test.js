/*
* File: model.test.js
* Version: 
* Date: 2020-06-10
* Author: CoffeeCode <coffeecodeswe@gmail.com>
* Description: File con i test riguardanti il model
* Remarks:
*/

const Model = require('./../js/model');

let model;

beforeAll(() => {
  model = new Model();
  model.readFromCVS("./test/csvExample.CSV");
});

test('notes', () => {
  model.loadPredictor("./test/p.json");

  expect(model.notes).toBe("notes");
});

test('construct', () => {
  expect(model).not.toBe(null);
});

test('test of readFromCVS', () => {
  expect(model.cvsFile).not.toBe(null);
});

test('test of getDataByFilter', () => {
  let dat = model.getDataByFilter({variables: ["a","c"], target: "d"});
  console.log(dat);

  expect(dat).toEqual({
    variables:{ a: ['1','6','2','6'], c:['4','5','1','1']},
    target: { d: ['2','1','7','5']}
  });
});


