var gulp = require('gulp');
var uglify = require('gulp-uglify');
var livereload = require('gulp-livereload');
var concat = require('gulp-concat');
var minifyCss = require('gulp-minify-css');
var autoprefixer = require('gulp-autoprefixer');
var plumber = require('gulp-plumber');
var sourcemaps = require('gulp-sourcemaps');
var sass = require('gulp-sass');
var babel = require('gulp-babel');
var del = require('del');
var zip = require('gulp-zip');


//scripts_path
var SCRIPTS_PATH = 'public/scripts/**/*.js'
var CSS_PATH = 'public/css/**/*.css';
var DIST_PATH = 'public/dist';
var TEMPLATES_PATH = 'templates/**/*.hbs';
var IMAGES_PATH = 'public/images/**/*.{png,jpg,jpeg,svg,gif}';

//Image compression
var imagemin = require('gulp-imagemin');
var imageminPngquant = require('imagemin-pngquant');
var imageminJpegRecompress = require('imagemin-jpeg-recompress');


//handlebars plugins and variable
var handlebars = require('gulp-handlebars');
var handlebarsLib = require('handlebars');
var declare = require('gulp-declare');
var wrap = require('gulp-wrap');

//styles
gulp.task('styles', function () {
    console.log("Style task is running");
    return gulp.src(['public/css/reset.css', CSS_PATH])
        .pipe(plumber(function (err) {
            console.log('STYLE TASK ERROR:');
            console.log(err);
            this.emit('end');
        }))
        .pipe(sourcemaps.init())
        .pipe(autoprefixer({
            browsers: ['last 2 versions', 'ie 8']
        }))
        .pipe(concat('styles.css'))
        .pipe(minifyCss())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(DIST_PATH))
        .pipe(livereload());
});

// Styles for SCSS
/*gulp.task('styles', function () {
    console.log("SASS Style task is running");
    return gulp.src('public/scss/styles.scss')
        .pipe(plumber(function (err) {
            console.log('STYLE TASK ERROR:');
            console.log(err);
            this.emit('end');
        }))
        .pipe(sourcemaps.init())
        .pipe(autoprefixer({
            browsers: ['last 2 versions', 'ie 8']
        }))
        .pipe(sass({
            outputStyle: 'compressed'
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(DIST_PATH))
        .pipe(livereload());
});*/

//script
gulp.task('script', function () {
    console.log("Script is running");

    return gulp.src(SCRIPTS_PATH)
        .pipe(plumber(function (err) {
            console.log("Scripts task Error");
            console.log(err);
            this.emit('end');
        }))
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(uglify())
        .pipe(concat('scripts.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(DIST_PATH))
        .pipe(livereload());
});

//Images
gulp.task('images', function () {
    return gulp.src(IMAGES_PATH)
        .pipe(imagemin([
        imagemin.gifsicle(),
        imagemin.jpegtran(),
        imagemin.optipng(),
        imagemin.svgo(),
        imageminPngquant(),
        imageminJpegRecompress()
    ]))
        .pipe(gulp.dest(DIST_PATH + '/images'));
});

gulp.task('clean', function () {
    return del.sync([
    'public/dist/main.js', 'html.html'
    ])
});

gulp.task('templates', function () {
    return gulp.src(TEMPLATES_PATH)
        .pipe(handlebars({
            handlebars: handlebarsLib
        }))
        .pipe(wrap('Handlebars.template(<%= contents %>)'))
        .pipe(declare({
            namespace: 'templates',
            noRedeclare: true
        }))
        .pipe(concat('templates.js'))
        .pipe(gulp.dest(DIST_PATH))
        .pipe(livereload());
});

gulp.task('default', ['images', 'templates', 'styles', 'script'], function () {
    console.log("Starting default task");
});

gulp.task('export', function () {
    return gulp.src('public/**/*')
        .pipe(zip('website.zip'))
        .pipe(gulp.dest('./'))
});

// This will run script and styles first
gulp.task('watch', ['script', 'styles'], function () {
    console.log("Watch Task created");
    require('./server.js');
    livereload.listen();
    gulp.watch(SCRIPTS_PATH, ['script']);
    gulp.watch(CSS_PATH, ['styles']);
    gulp.watch(TEMPLATES_PATH, ['templates']);
});

/*gulp.task('watch', function () {
    console.log("Watch Task created");
    require('./server.js');
    livereload.listen();
    gulp.watch(SCRIPTS_PATH, ['script']);
    gulp.watch(CSS_PATH, ['styles']);
});*/