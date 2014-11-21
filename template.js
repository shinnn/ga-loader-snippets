var commonPart = '${commonPart}';

var gaLoaderSnippets = {
  <% snippets.forEach(function(snippet, index) { %>with${index + 3}params: '${snippet}'<% if (index !== snippets.length - 1) { %>,
  <% } %><% }); %>
};
