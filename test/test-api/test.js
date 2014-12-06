/*jshint unused:true */
'use strict';

var maxLineLength = require('max-line-length');
var requireBowerFiles = require('require-bower-files');
var test = require('tape');

function runTest(description, gaLoaderSnippets) {
  var keys = Object.keys(gaLoaderSnippets);

  test(description, function(t) {
    t.plan(1);

    t.deepEqual(
      keys.map(function(key) {
        return typeof gaLoaderSnippets[key];
      }),
      ['string', 'string', 'string', 'string', 'string'],
      'should contain five strings.'
    );
  });

  keys.forEach(function(key) {
    test('Maximum line length of ' + description + '.' + key, function(t) {
      t.plan(1);

      t.ok(maxLineLength(gaLoaderSnippets[key]) < 90, 'should be lower than 90.');
    });
  });
}

runTest('require(\'ga-loder-snippets\')', require('../..'));

global.window = {};
requireBowerFiles({self: true});

runTest('window.gaLoaderSnippets', window.gaLoaderSnippets);
