var katex = require('katex');
var fileSystem = require('fs');

var renderKatexFormula = function(text, displayMode) {
  try {
    return katex.renderToString(text, { displayMode: displayMode });
  } catch (err) {
    console.log('Katex error trying to parse: "' +text + '". Description: ' + err);
  }
};

module.exports = function(inlineMathSelector, displayMathSelector) {
  var inlineVsDisplayLogic = typeof displayMathSelector !== 'undefined' ? 'separateSelector' : 'spanIsInline';

  inlineMathSelector = arguments.length > 0 ? inlineMathSelector : '.math';

  return function(deck) {
    var foundMath = false,
      mathElements;
    switch (inlineVsDisplayLogic) {
      case 'separateSelector':
        mathElements = deck.parent.querySelectorAll(inlineMathSelector);
        Array.prototype.slice.call(mathElements).forEach(function(el) {
          el.innerHTML = renderKatexFormula(el.innerText, false);
          foundMath = true;
        });
        mathElements = deck.parent.querySelectorAll(displayMathSelector);
        Array.prototype.slice.call(mathElements).forEach(function(el) {
          el.innerHTML = renderKatexFormula(el.innerText, true);
          foundMath = true;
        });
        break;

      case 'spanIsInline':
        mathElements = deck.parent.querySelectorAll(inlineMathSelector);
        Array.prototype.slice.call(mathElements).forEach(function(el) {
          el.innerHTML = renderKatexFormula(el.innerText, el.tagName.toLowerCase() !== 'span');
          foundMath = true;
        });
        break;
    }

    if (foundMath) {
      try {
        require('../katex/katex.min.css');
      } catch (e) {
        console.log('It was not possible to load the CSS from KaTeX. Details: ' + e);
      }
    }
  };
};
