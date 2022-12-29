const gulp = require("gulp");
const { src, dest, watch, parallel, series } = require("gulp")
var inject = require('gulp-inject');
var replace = require('gulp-replace-image-src');
const rep =require('gulp-replace-index-src')

var globs={
  html:"project/*.html",
  css:"project/css/**/*.css",
  img:'project/pics/*',
  js:'project/js/**/*.js'
}
const imagemin = require('gulp-imagemin');
function imgTast() {
    return gulp.src(globs.img)
        .pipe(imagemin())
        .pipe(gulp.dest('dist/images'));
}
exports.img = imgTast

const htmlmin = require('gulp-htmlmin');
function htmlTast() {
  return src(globs.html) 
  .pipe(inject(src('./dist/assets/css/style.min.css')))
  .pipe(inject(src('./dist/assets/js/all.min.js')))
  .pipe(replace ({
    prependSrc : '/dist/images/',
    keepOrigin : false
  }))
        .pipe(htmlmin({ collapseWhitespace: true, removeComments: true }))
        .pipe(gulp.dest('dist'))
}
exports.html = htmlTast
const concat = require('gulp-concat');
const terser = require('gulp-terser');

function jsTast() {
    return src(globs.js,{sourcemaps:true}) 
    
        .pipe(concat('all.min.js'))
        .pipe(terser())
        .pipe(dest('./dist/assets/js',{sourcemaps:'.'}))
}
exports.js = jsTast
var cleanCss = require('gulp-clean-css');
function cssTast() {
    return src(globs.css)
        .pipe(concat('style.min.css'))
        .pipe(cleanCss())
        .pipe(dest('./dist/assets/css'))
}
exports.css = cssTast
var browserSync = require('browser-sync');
function serve (cb){
  browserSync({
    server: {
      baseDir: './dist/'
    }
  });
  cb()
}
function reloadTask(done) {
  browserSync.reload()
  done()
}


function watchTask() {
    watch(globs.html,series(htmlTast, reloadTask))
    watch(globs.js,series(jsTast, reloadTask))
    watch(globs.css, series(cssTast,reloadTask));
    watch(globs.img, series(imgTast,reloadTask));
}
exports.default = series( parallel(imgTast, jsTast, cssTast, htmlTast), serve , watchTask)

