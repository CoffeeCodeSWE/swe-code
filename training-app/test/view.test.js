/*
* File: view.test.js
* Version: 
* Date: 2020-06-10
* Author: CoffeeCode <coffeecodeswe@gmail.com>
* Description: File con i test riguardanti la view
* Remarks:
*/

const View = require('./../js/view');

test('test of showContent', () => {
  let view = new View();
  view.showContent;

  expect(view.content.attr).not.toBe("hidden");
});

// test('test of hideContent', () => {
//   let view = new View();
//   view.hideContent;

//   expect(view.content.attr).toBe("hidden");
// });

test('test of showChart', () => {
  let view = new View();
  view.showChart;

  expect(view.chartField.div.attr).not.toBe("hidden");
});

// test('test of hideChart', () => {
//   let view = new View();
//   view.hideChart;

//   expect(view.chartField.div.attr).toBe("hidden");
// });

