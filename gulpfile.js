/*jshint unused:true */
'use strict';

var exec = require('child_process').exec;

var $ = require('gulp-load-plugins')();
var eachAsync = require('each-async');
var gulp = require('gulp');
var mergeStream = require('merge-stream');
var readGlob = require('read-glob-promise');
var rimraf = require('rimraf');
var stylish = require('jshint-stylish');
var toCamelCase = require('to-camel-case');
var stringifyObject = require('stringify-object');

var bower = require('./bower.json');
var pkg = require('./package.json');
var varName = toCamelCase(pkg.name);

var banner = [
  '/*!',
  ' * HTML5 Boilerplate | MIT (c) HTML5 Boilerplate',
  ' * https://github.com/h5bp/html5-boilerplate',
  ' *',
  ' * ga-loader-snippets | MIT (c) Shinnosuke Watanabe',
  ' * https://github.com/shinnn/ga-loader-snippets',
  '*/\n'
].join('\n');

var parts = [
  '!function(A,B,C',
  '){A.GoogleAnalyticsObject=C,A[C]||(A[C]=function(){\\n' +
  '(A[C].q=A[C].q||[]).push(arguments)}),A[C].l=+new Date',
  '=B.createElement(',
  '"//www.google-analytics.com/analytics.js"',
  '.parentNode.insertBefore(',
  '=B.getElementsByTagName(D)[0],',
  '(window,document,"ga"'
];

var productionDir = 'snippets-production';
var casperjsPath = 'node_modules/.bin/casperjs';
if (process.platform === 'win32') {
  casperjsPath += '.exe';
}

gulp.task('lint', function() {
  gulp.src(['{,test/*/}*.js', '!template.js'])
    .pipe($.jshint())
    .pipe($.jshint.reporter(stylish))
    .pipe($.jscs('.jscs.json'));
  gulp.src('*.json')
    .pipe($.jsonlint())
    .pipe($.jsonlint.reporter());
});

gulp.task('clean:minify', rimraf.bind(null, productionDir));

gulp.task('minify', ['clean:minify'], function() {
  return gulp.src('snippets-development/*.js')
    .pipe($.uglify({mangle: false}))
    .pipe($.replace(/\(\){|Element\(.+?\).|js",|\(F,G\)}/g, '$&\n'))
    .pipe($.rename({suffix: '-production'}))
    .pipe(gulp.dest(productionDir));
});

gulp.task('clean:dist', rimraf.bind(null, 'scripts'));

gulp.task('build', ['lint', 'clean:dist', 'minify'], function(cb) {
  readGlob(productionDir + '/*.js', 'utf8').then(function(contents) {
    var snippets = contents.map(function(content) {
      content = content.replace(/\n/g, '\\n');

      parts.forEach(function(part, idx) {
        content = content.replace(part, '\' + parts[' + idx + '] + \'');
      });

      return ('\'' + content + '\'').replace(/(^'|'') \+ /g, '');
    });

    var templateOptions = {
      parts: stringifyObject(parts, {indent: '  '}),
      snippets: snippets
    };

    mergeStream(
      gulp.src('template.js')
        .pipe($.template(templateOptions))
        .pipe($.header(banner + '!function() {\n', {pkg: pkg}))
        .pipe($.footer('\nwindow.' + varName + ' = ' + varName + ';\n}();\n'))
        .pipe($.rename(bower.main))
        .pipe(gulp.dest('')),
      gulp.src('template.js')
        .pipe($.template(templateOptions))
        .pipe($.header(banner, {pkg: pkg}))
        .pipe($.footer('\nmodule.exports = ' + varName + ';\n'))
        .pipe($.rename(pkg.main))
        .pipe(gulp.dest(''))
    ).on('end', cb);
  });
});

gulp.task('test', ['build'], function(cb) {
  eachAsync([
    'node test/test-node/test.js',
    casperjsPath + ' test test/test-browser/run-casper.js'
  ], function(cmd, i, next) {
    exec(cmd, function(err, stderr, stdout) {
      console.log(stderr);
      console.warn(stdout);
      next(err);
    });
  }, cb);
});

gulp.task('watch', function() {
  gulp.watch(['{,src/}*.js'], ['test']);
  gulp.watch(['*.json', '.jshintrc'], ['lint']);
});

gulp.task('default', ['test', 'watch']);
