var gulp = require('gulp'),
  uglify = require('gulp-uglify'),
  eslint = require('gulp-eslint')
  rename = require('gulp-rename'),
  mocha = require('gulp-mocha'),
  cover = require('gulp-coverage');

var libSrc = 'finnish-ssn.js',
    specSrc = 'test/finnish-ssn_test.js',
    minified = 'finnish-ssn.min.js';

gulp.task('lint', function () {
    return gulp.src([libSrc])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
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

gulp.task('default', [ 'lint', 'test', 'build' ], function () {
});
