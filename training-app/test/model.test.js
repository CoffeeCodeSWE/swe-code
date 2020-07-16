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

  expect(dat).toEqual({
    variables:{ a: ['1','6','2','6'], c:['4','5','1','1']},
    target: { d: ['2','1','7','5']}
  });
});

test('test of calculatePredictor', () => {
  let dat = model.getDataByFilter({variables: ["a","c"], target: "d"});
  let out = model.calculatePredictor(dat,{model : "rl" , notes: "prova"});

  console.log(out);
  expect(out).toEqual({
    type: 'rl',
    predictor: {
      tuples: 4,
      coefficents: { a: -0.15909090909090848, c: -1.2651515151515156 },
      intercept: 7.825757575757575,
      target: 'd'
    },
    notes: 'prova'
  });
});


