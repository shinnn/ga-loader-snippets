/*jshint unused:true, evil: true */
'use strict';

casper.start('test/test-browser/index.html', function() {
  casper.test.begin('window.gaLoaderSnippets', 1, function(test) {
    test.assertEvalEquals(function() {
      return typeof gaLoaderSnippets;
    }, 'object', 'should be an object.');
    test.done();
  });

}).each([3, 4, 5, 6, 7], function(itself, paramNum) {
  itself.test.begin('GA script snippet with ' + paramNum + ' parameters', 4, function(test) {
    itself.reload(function() {
      itself.evaluate(function(num) {
        eval(window.gaLoaderSnippets['with' + num + 'params']);
      }, paramNum);
      test.assertEvalEquals(function() {
        return window.GoogleAnalyticsObject;
      }, 'ga', 'should create `window.GoogleAnalyticsObject` property.');
      test.assertEvalEquals(function() {
        return typeof window.ga;
      }, 'function', 'should create a function `window.ga`.');
      test.assertEvalEquals(function() {
        return typeof window.ga.l;
      }, 'number', 'should set `window.ga.l` property.');
      test.assertEquals(
        casper.getElementAttribute('script', 'src'),
        '//www.google-analytics.com/analytics.js',
        'should load analytics.js.'
      );
      test.done();
    });
  });
}).run();
