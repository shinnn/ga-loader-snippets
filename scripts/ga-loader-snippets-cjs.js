/*!
 * HTML5 Boilerplate | MIT (c) HTML5 Boilerplate
 * https://github.com/h5bp/html5-boilerplate
 *
 * ga-loader-snippets | MIT (c) Shinnosuke Watanabe
 * https://github.com/shinnn/ga-loader-snippets
*/
var commonPart = '){A.GoogleAnalyticsObject=C,A[C]||(A[C]=function(){\n(A[C].q=A[C].q||[]).push(arguments)}),A[C].l=+new Date';

var gaLoaderSnippets = {
  with3params: '!function(A,B,C' + commonPart + ';var s=B.createElement("script"),\ne=B.scripts[0];s.src="//www.google-analytics.com/analytics.js",\ne.parentNode.insertBefore(s,e)}(window,document,"ga");',
  with4params: '!function(A,B,C,D' + commonPart + ',D=B.createElement("script");\nvar e=B.scripts[0];D.src="//www.google-analytics.com/analytics.js",\ne.parentNode.insertBefore(D,e)}(window,document,"ga");',
  with5params: '!function(A,B,C,D,E' + commonPart + ',D=B.createElement("script"),\nE=B.scripts[0],D.src="//www.google-analytics.com/analytics.js",\nE.parentNode.insertBefore(D,E)}(window,document,"ga");',
  with6params: '!function(A,B,C,D,E,F' + commonPart + ',E=B.createElement(D),\nF=B.getElementsByTagName(D)[0],E.src="//www.google-analytics.com/analytics.js",\nF.parentNode.insertBefore(E,F)}(window,document,"ga","script");',
  with7params: '!function(A,B,C,D,E,F,G' + commonPart + ',F=B.createElement(D),\nG=B.getElementsByTagName(D)[0],F.src=E,G.parentNode.insertBefore(F,G)}\n(window,document,"ga","script","//www.google-analytics.com/analytics.js");'
};

module.exports = gaLoaderSnippets;
