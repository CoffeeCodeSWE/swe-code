/*
* File: integration.test.js
* Version: 
* Date: 2020-06-26
* Author: CoffeeCode <coffeecodeswe@gmail.com>
* Description: File con i test di sistema
* Remarks:
*/

const View = require('./../js/view');
const Model = require('./../js/model');
const Controller = require('./../js/controller');
let model;

beforeAll(() => {
  model = new Model();
  model.readFromCVS("./test/csvExample.CSV");
});

test('test of calculatePredictor', () => {
  let dat = model.getDataByFilter({variables: ["a","c"], target: "d"});
  let out = model.calculatePredictor(dat,{model : "rl" , notes: "prova"});
  expect(out.predictor.coefficents).toEqual({ a: -0.15909090909090848, c: -1.2651515151515156 });
});