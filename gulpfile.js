var gulp        = require('gulp'),
    uglify      = require('gulp-uglify'),
    watch       = require('gulp-watch'),
    imagemin    = require('gulp-imagemin'),
    less        = require('gulp-less'),
    prefix      = require('gulp-autoprefixer'),
    cssmin      = require('gulp-cssmin'),
    sourcemaps  = require('gulp-sourcemaps'),
    concat      = require('gulp-concat'),
    rename      = require("gulp-rename"),
    exec        = require('child_process').exec;

function puts(error, stdout, stderr) { console.log(stdout) }

var paths = {
  old_scr: ['src/javascripts/libraries/socket.*.js',
            'src/javascripts/libraries/jquery-1.11.1.js',
            'src/javascripts/libraries/angular1.2.22.js',
            'src/javascripts/*.js'
            ],
  scripts: ['src/javascripts/libraries/socket.*.js',
            'src/javascripts/libraries/jquery-2.1.1.js',
            'src/javascripts/libraries/bootstrap*.js',
            'src/javascripts/libraries/angular1.3.0-beta.18.js',
            'src/javascripts/*.js'
            ],
  images: ['src/images/**/*', 'src/images/*'],
  css: ['src/stylesheets/libraries/bootstrap/bootstrap.less',
        'src/stylesheets/*.less'],
  minify: ['./public/css/*.css', '!./public/css/update.css', '!./public/css/*.min.css']
};

gulp.task('images', function() {
  return gulp.src(paths.images)
    .pipe(imagemin({optimizationLevel: 5}))
    .pipe(gulp.dest('public/img'));
});

gulp.task('scripts', function() {
  return gulp.src(paths.scripts)
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(concat('all.min.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('public/js/'));
});

gulp.task('css', function() {
  return gulp.src(paths.css)
    .pipe(sourcemaps.init())
    .pipe(less())
    .pipe(prefix(["last 2 version", "> 1%", "ie 8", "ie 7", "ie 6"]))
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest('./public/css'));
});

gulp.task('minify', function() {
  return gulp.src(paths.minify)
    .pipe(cssmin())
    .pipe(concat('all.css'))
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('./public/css'));
});

gulp.task('watch', function() {
  gulp.watch(paths.scripts, ['scripts']);
  gulp.watch(paths.images, ['images']);
  gulp.watch(paths.css, ['css']);
  gulp.watch(paths.minify, ['minify']);
});

gulp.task('start', function(){
  exec("npm start", puts);
});

gulp.task('mongodb', function(){
  exec('"C:/Program Files/MongoDB 2.6 Standard/bin/mongod.exe" --dbpath ' + __dirname + '/mongodb', puts);
});

gulp.task('default', ['watch', 'scripts', 'css', 'minify', 'images']);
gulp.task('dev', ['start', 'mongodb', 'default']);
