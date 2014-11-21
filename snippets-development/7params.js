(function (A, B, C, D, E, F, G) {
  A.GoogleAnalyticsObject = C;
  A[C] || (A[C] = function() {
    (A[C].q = A[C].q || []).push(arguments);
  });
  A[C].l = +new Date;
  F = B.createElement(D);
  G = B.getElementsByTagName(D)[0];
  F.src = E;
  G.parentNode.insertBefore(F, G);
})(window, document, 'ga', 'script', '//www.google-analytics.com/analytics.js');
