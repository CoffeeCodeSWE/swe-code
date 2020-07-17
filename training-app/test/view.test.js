/*
* File: view.test.js
* Version: 
* Date: 2020-06-10
* Author: CoffeeCode <coffeecodeswe@gmail.com>
* Description: File con i test riguardanti la view
* Remarks:
*/

const View = require('./../js/view');

let view;

beforeAll(() => {
  view = new View();
});

test('test of showContent', () => {
  view.showContent();
  expect(view.content.attr).not.toBe("hidden");
});

// test('test of hideContent', () => {
//   let view = new View();
//   view.hideContent();
//   console.log(view.content.attr);
//   expect(view.content.attr).toEqual("hidden");
// });

test('test of showChart', () => {
  view.showChart();

  expect(view.chartField.div.attr).not.toBe("hidden");
});

// test('test of hideChart', () => {
//   let view = new View();
//   view.hideChart;

//   expect(view.chartField.div.attr).toBe("hidden");
// });

// test('test of setNotes', () => {
//   let notes = "notes";
//   view.setNotes(notes);

//   expect(view.notesInput.val()).toEqual("notes");
// });

test('test of getRandomColor', () => {
  let color = view.getRandomColor();

  expect(color).not.toBe(null);
  expect(color).toHaveLength(7);
  expect(color).toBeTruthy();
});

// test('test of reset', () => {
//   view.reset();

//   expect(view.content...).toEqual("hidden");
//   expect(view.chartField...).toEqual("hidden");
//   expect(view.selectVars).toBe("");
//   expect(view.selectTarget).toBe("");
//   expect(view.chartField.xSelect).toBe("");
//   expect(view.chartField.ySelect).toBe("");
//   expect(view.chartField.tSelect).toBe("");
//   expect(view.notesInput).toBe("");
// });

