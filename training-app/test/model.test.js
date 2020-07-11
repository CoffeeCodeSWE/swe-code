
const Model = require('./../js/model');

let model;

beforeAll(() => {
  model = new Model();
});

test('notes', () => {
  model.loadPredictor("./test/p.json");

  expect(model.notes).toBe("notes");
});

test('construct', () => {
  expect(model).not.toBe(null);
});

test('test of readFromCVS', () => {
  model.readFromCVS("./test/csvExample.CSV");

  expect(model.cvsFile).not.toBe(null);
});


