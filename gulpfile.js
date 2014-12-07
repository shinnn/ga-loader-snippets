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
var stringifyObject = require('stringify-object');

var bower = require('./bower.json');
var pkg = require('./package.json');

var parts = [
  '!function(A,B,C',
  '){A.GoogleAnalyticsObject=C;A[C]||(A[C]=function(){\\n' +
  '(A[C].q=A[C].q||[]).push(arguments)});A[C].l=+new Date',
  '=B.createElement(',
  '"//www.google-analytics.com/analytics.js"',
  '.parentNode.insertBefore(',
  '=B.getElementsByTagName(D)[0];',
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
    .pipe($.jshint.reporter('fail'))
    .pipe($.jscs('package.json'));
  gulp.src('*.json')
    .pipe($.jsonlint())
    .pipe($.jsonlint.reporter());
});

gulp.task('clean:minify', rimraf.bind(null, productionDir));

gulp.task('minify', ['clean:minify'], function() {
  return gulp.src('*.js', {cwd: 'snippets-development'})
    .pipe($.uglify({
      mangle: false,
      compress: {sequences: false}
    }))
    .pipe($.replace(/\(\){|Element\(.+?\).|js";|\(F,G\)}/g, '$&\n'))
    .pipe($.rename({suffix: '-production'}))
    .pipe($.size({showFiles: true}))
    .pipe(gulp.dest(productionDir));
});

gulp.task('clean:dist', rimraf.bind(null, 'scripts'));

gulp.task('build', ['lint', 'clean:dist', 'minify'], function(cb) {
  readGlob(productionDir + '/*.js', 'utf8').then(function(contents) {
    var snippets = contents.map(function(content) {
      content = parts.reduce(function(result, part, idx) {
        return result.replace(part.replace(/\\n/g, '\n'), '\' + parts[' + idx + '] + \'');
      }, content).replace(/\n/g, '\\n');

      return ('\'' + content + '\'').replace(/(^'|'') \+ /g, '');
    });

    var partsStringified = stringifyObject(parts, {indent: '  '});

    var commonJs = gulp.src('template.js')
      .pipe($.template({
        parts: partsStringified,
        snippets: snippets,
        wrap: false
      }))
      .pipe($.rename(pkg.main))
      .pipe($.jscs({maximumLineLength: 170}))
      .pipe(gulp.dest(''));

    var browser = gulp.src('template.js')
      .pipe($.template({
        parts: partsStringified,
        snippets: snippets,
        wrap: true
      }))
      .pipe($.rename(bower.main))
      .pipe($.jscs({maximumLineLength: 170}))
      .pipe(gulp.dest(''));

    mergeStream(commonJs, browser).on('end', cb);
  }, cb);
});

gulp.task('test', ['build'], function(cb) {
  eachAsync([
    'node test/test-api/test',
    casperjsPath + ' test test/test-browser/run-casper.js'
  ], function(cmd, index, next) {
    exec(cmd, function(err, stderr, stdout) {
      process.stdout.write(stderr);
      process.stderr.write(stdout);
      next(err);
    });
  }, cb);
});

gulp.task('watch', function() {
  gulp.watch('{,src/}*.js', ['test']);
  gulp.watch('{*.json,.jshintrc}', ['lint']);
});

gulp.task('default', ['test', 'watch']);
