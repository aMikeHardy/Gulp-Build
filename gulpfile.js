"use strict";

var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var maps = require('gulp-sourcemaps');
var sass = require('gulp-sass');
var del = require('del');
var cleanCSS = require('gulp-clean-css');
var image = require('gulp-image');
var server = require('gulp-live-server');

//concat scripts into one file, app.js
gulp.task("concatScripts", function(){
  return gulp.src([
    'js/global.js',
    'js/circle/circle.js',
    'js/circle/autogrow.js'
  ])
  .pipe(maps.init())
  .pipe(concat('app.js'))
  .pipe(maps.write('./'))
  .pipe(gulp.dest('js'));
});

//minify JavaScript files after concatination
gulp.task("minifyScripts", gulp.series('concatScripts', function() {
  return gulp.src("js/app.js")
  .pipe(uglify())
  .pipe(rename('all.min.js'))
  .pipe(gulp.dest('js'));
}));

//concat, minify and copy scripts
gulp.task("scripts", gulp.series('concatScripts', 'minifyScripts', function(){
  return gulp.src('js/all.min.js')
  .pipe(gulp.dest('dist/scripts'));
}));

//compile Sass and generate source maps
gulp.task('compileSass', function() {
  return gulp.src('sass/**/*.scss')
  .pipe(maps.init())
  .pipe(sass())
  .pipe(maps.write('./'))
  .pipe(gulp.dest('dist/styles'));
});

//compile sass, create source maps and minify
gulp.task('styles', gulp.series('compileSass', function (){
  return gulp.src('dist/styles/global.css')
  .pipe(cleanCSS())
  .pipe(rename('all.min.css'))
  .pipe(gulp.dest('dist/styles'))
}));

//copy css to css directory
gulp.task('css', function(){
  return gulp.src('dist/styles/all.min.css')
  .pipe(rename('global.css'))
  .pipe(gulp.dest('css'));
})

//opitmize images
gulp.task('images', function() {
  return gulp.src('images/*')
  .pipe(image())
  .pipe(gulp.dest('dist/content'));
});

//delete dist folder and minified and compiled script files
gulp.task('clean', function(){
  return del(['dist', 'js/all.min.js', 'js/app*.js*', 'css']);
});

//serve on port 3000
gulp.task('serve', function(){
  var serv = server.static(['./', 3000]);
  serv.start();
});

gulp.task('build', gulp.series('clean','scripts', 'styles', 'images', 'css', function(){
  return gulp.src(['dist/scripts/all.min.js', 'dist/styles/*', 'dist/content/*'])
  pipe(gulp.dest('dist'));
}));

gulp.task('default', gulp.series('clean', 'build', 'serve'));
