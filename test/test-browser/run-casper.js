/*jshint unused:true, evil:true */
'use strict';

casper.start('test/test-browser/index.html', function() {
  casper.test.begin('window.gaLoaderSnippets', 1, function(test) {
    test.assertEvalEquals(function() {
      return typeof gaLoaderSnippets;
    }, 'object', 'should be an object.');
    test.done();
  });

}).each([3, 4, 5, 6, 7], function(self, paramNum) {
  self.test.begin('GA script snippet with ' + paramNum + ' parameters', 5, function(test) {
    self.reload(function() {
      var scripts = self.getElementsInfo('script');

      self.evaluate(function(num) {
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

      test.assertElementCount(
        'script',
        scripts.length + 1,
        'should create a new script element.'
      );

      test.assertEquals(
        casper.getElementAttribute('script', 'src'),
        '//www.google-analytics.com/analytics.js',
        'should load analytics.js.'
      );

      test.done();
    });
  });
}).run();
