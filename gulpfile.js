var gulp = require('gulp'),
  uglify = require('gulp-uglify'),
  jshint = require('gulp-jshint'),
  rename = require('gulp-rename'),
  mocha = require('gulp-mocha'),
  cover = require('gulp-coverage');

var libSrc = 'finnish-ssn.js',
    specSrc = 'test/finnish-ssn_test.js',
    minified = 'finnish-ssn.min.js';

gulp.task('hint', function () {
  gulp.src(libSrc)
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('test', [], function () {
  return gulp.src([specSrc], { read: false })
    .pipe(cover.instrument({
      pattern: [libSrc],
      debugDirectory: 'debug'
    }))
    .pipe(mocha())
    .pipe(cover.gather())
    .pipe(cover.format())
    .pipe(gulp.dest('reports'));
});

gulp.task('build', [], function () {
  gulp.src(libSrc)
    .pipe(uglify({preserveComments: 'some'}))
    .pipe(rename(minified))
    .pipe(gulp.dest('./'));
});

gulp.task('default', [ 'hint', 'test', 'build' ], function () {
});
