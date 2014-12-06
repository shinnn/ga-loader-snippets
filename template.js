/*!
 * HTML5 Boilerplate | MIT (c) HTML5 Boilerplate
 * https://github.com/h5bp/html5-boilerplate
 *
 * ga-loader-snippets | MIT (c) Shinnosuke Watanabe
 * https://github.com/shinnn/ga-loader-snippets
*/
<% if (exportsWindow) { %>!function() {<% } %>
var parts = ${parts};

<% if (exportsWindow) { %>window.gaLoaderSnippets<% } else { %>module.exports<% } %> = {
  <% snippets.forEach(function(snippet, index) { %>with${index + 3}params: ${snippet}<% if (index !== snippets.length - 1) { %>,
  <% } %><% }); %>
};<% if (exportsWindow) { %>}();<% } %>
