/*jshint unused:true */
'use strict';

var gaLoaderSnippets = require('../../');
var maxLineLength = require('max-line-length');
var test = require('tape');

var keys = Object.keys(gaLoaderSnippets);

test('require(\'ga-loder-snippets\')', function(t) {
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
  test('Maximum line length of gaLoaderSnippets.' + key, function(t) {
    t.plan(1);

    t.ok(maxLineLength(gaLoaderSnippets[key]) < 90, 'should be lower than 90.');
  });
});
