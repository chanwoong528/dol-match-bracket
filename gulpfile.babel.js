const gulp = require("gulp");
const clean = require('gulp-clean');
const ts = require("gulp-typescript");
const uglify = require("gulp-uglify");
const rename = require('gulp-rename');
const sass = require('gulp-sass')(require('sass'));
const webserver = require("gulp-webserver");

const paths = {
  dist : ["dist"],
  src : ["src"],
}

gulp.task("clean", function () {
  return gulp.src([`${paths.dist}/js`, `${paths.dist}/css`], {allowEmpty:true})
    .pipe(clean());
});

// babel
gulp.task("babel", function () {
  return gulp.src("src/*.ts")
    .pipe(ts({
      noImplicitAny: true,
      // module: "commonjs"
      module: "es6",
      target: "es5"
    }))
    .pipe(uglify()) // minify
    .pipe(rename(function (p) {
      p.basename += '.min';
    }))
    .pipe(gulp.dest(`${paths.dist}/js`));
});

gulp.task("sass", function(){
  return gulp.src(`${paths.src}/*.scss`)
    .pipe(sass())
    .pipe(rename(function (p) {
      p.basename += '.min';
    }))
    .pipe(gulp.dest(`${paths.dist}/css`));
})

// webserver
gulp.task("webserver", function(){
  gulp.src(paths.dist)
    .pipe(
      webserver({
        port: 5000,
        livereload: true,
        open: true,
      })
    );
});

gulp.task("builds", gulp.series("clean", "babel", "sass"));

// watch
gulp.task("watch", function(){
  gulp.watch(`${paths.src}/*`, gulp.series("builds"));
});


gulp.task("dev", gulp.parallel("builds", "webserver", "watch"));
gulp.task("build", gulp.parallel("builds"));
gulp.task("default", gulp.parallel("builds"));