var gulp = require('gulp');
var uglify = require('gulp-uglify');
var ngAnnotate = require('gulp-ng-annotate')
var livereload = require('gulp-livereload');
var concat = require('gulp-concat');

// File Paths
var DIST_PATH = '';
var DIST_CSS = DIST_PATH + 'css';
var DIST_SCRIPTS = DIST_PATH + 'scripts';
var DIST_IMAGES = DIST_PATH + 'assets/images';
var DIST_DOCS = DIST_PATH + 'assets/docs';
var SCRIPTS_PATH = 'src/scripts/**/*.js';
var APP_SCRIPTS_PATH = 'src/scripts/app/**/*.js';
var VENDOR_SCRIPTS_PATH = 'src/scripts/vendor/**/*.js';
var CSS_APP_PATH = 'src/css/app/*.css';
var CSS_VENDOR_PATH = 'src/css/vendor/*.css';
var IMAGE_PATH = "src/images/**/*";
var DOCS_PATH = "src/docs/**/*.md";

// Styles
gulp.task('styles', function(){
  console.log('Starting styles task');
  gulp.start('appStyles');
  gulp.start('vendorStyles');
});

// Styles - Custom css
gulp.task('appStyles', function(){
    console.log('Starting custom styles task');
    return gulp.src(['src/css/reset.css',CSS_APP_PATH])
        .pipe(concat('styles.css'))
        .pipe(gulp.dest(DIST_CSS))
        .pipe(livereload());
});

// Styles - Vendor css
gulp.task('vendorStyles', function(){
    console.log('Starting vendor styles task');
    return gulp.src(CSS_VENDOR_PATH)
        .pipe(gulp.dest(DIST_CSS))
        .pipe(livereload());
});

// Scripts
gulp.task('scripts', function(){
    console.log('Starting script task');
    gulp.start('appScripts');
    gulp.start('vendorScripts');
});

// Scripts - Custom
gulp.task('appScripts', function(){
    console.log('Starting App script task');
    return gulp.src(APP_SCRIPTS_PATH)
        .pipe(concat('app.js'))
        //.pipe(ngAnnotate())
        .pipe(uglify())
        .pipe(gulp.dest(DIST_SCRIPTS))
        .pipe(livereload());
});

// Scripts - Vendor
gulp.task('vendorScripts', function(){
    console.log('Starting Vendor script task');
    return gulp.src(VENDOR_SCRIPTS_PATH)
        .pipe(concat('vendor.js'))
        .pipe(ngAnnotate())
        .pipe(uglify())
        .pipe(gulp.dest(DIST_SCRIPTS))
        .pipe(livereload());
});

// Images
gulp.task('images', function(){
    console.log('Starting image task');
    return gulp.src(IMAGE_PATH)
        .pipe(gulp.dest(DIST_IMAGES))
        .pipe(livereload());
});

// Documents
gulp.task('documents', function(){
    console.log('Starting documents task');
    return gulp.src(DOCS_PATH)
        .pipe(gulp.dest(DIST_DOCS))
        .pipe(livereload());
});

//Default
gulp.task('default', function(){
    console.log('Starting default task');
    gulp.start('scripts');
    gulp.start('images');
    gulp.start('documents');
    gulp.start('styles');
});

// Watch
gulp.task('watch', function(){
  console.log('Starting watch task');    
  //require('./server.js');
  livereload.listen();
  gulp.watch([SCRIPTS_PATH, CSS_PATH],['scripts', 'styles']);
});
