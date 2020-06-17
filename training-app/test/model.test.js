
const Model = require('./../js/model');

test('notes', () => {
  let model = new Model();
  model.loadPredictor("./test/p.json");

  expect(model.notes).toBe("notes");
});

test('construct', () => {
  let model = new Model();

  expect(model).not.toBe(null);
});


