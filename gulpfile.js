const gulp = require('gulp');
const ts = require("gulp-typescript")
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');


const OUTPUT_DIR = './dist';

gulp.task('build',
  function () {
    return gulp.src('src/bracket.ts')
      .pipe(ts({
        noImplicitAny: true,
        // module: "commonjs"
        module: "es6",
        target: "es5"

      }))
      .pipe(uglify())
      .pipe(rename(function (p) {
        p.basename += '.min';
      }))
      .pipe(gulp.dest(OUTPUT_DIR));
  });

// gulp.task('default', ['test']);