(function(A, B, C) {
  A.GoogleAnalyticsObject = C;
  A[C] || (A[C] = function() {
    (A[C].q = A[C].q || []).push(arguments);
  });
  A[C].l = +new Date;
  var s = B.createElement('script'), e = B.scripts[0];
  s.src = '//www.google-analytics.com/analytics.js';
  e.parentNode.insertBefore(s, e);
}(window, document, 'ga'));
