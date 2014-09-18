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
    livereload  = require("gulp-livereload"),
    nodemon     = require('gulp-nodemon'),
    exec        = require('child_process').exec;

function puts(error, stdout, stderr) { console.log(error, stdout, stderr) }

var paths = {
  old_scr: ['src/javascripts/libraries/socket.*.js',
            'src/javascripts/libraries/jquery-1.11.1.js',
            'src/javascripts/libraries/angular1.2.22.js',
            'src/javascripts/*.js'
            ],
  scripts: ['src/javascripts/libraries/socket.*.js',
            'src/javascripts/libraries/jquery-2.1.1.js',
            'src/javascripts/libraries/bootstrap*.js',
            'src/javascripts/libraries/angular1.3.0-rc.2.js',
            'src/javascripts/libraries/angular-route.js',
            'src/javascripts/libraries/angular-touch.js',
            'src/javascripts/*.js'
            ],
  images: ['src/images/**/*', 'src/images/*'],
  css: ['src/stylesheets/libraries/bootstrap/bootstrap.less',
        'src/stylesheets/*.less'],
  minify: ['./public/css/*.css', '!./public/css/update.css', '!./public/css/*.min.css'],
  views: ['./views/*.jade'],
  routes: ['./routes/*.js'],
  main: './app.js'
};

gulp.task('images', function() {
  return gulp.src(paths.images)
    .pipe(imagemin({optimizationLevel: 5}))
    .pipe(gulp.dest('./public/img'))
    .pipe(livereload());
});

gulp.task('scripts', function() {
  return gulp.src(paths.scripts)
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(concat('all.min.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./public/js/'))
    .pipe(livereload());
});

gulp.task('css', function() {
  return gulp.src(paths.css)
    .pipe(sourcemaps.init())
    .pipe(less())
    .pipe(prefix({browsers: ['last 2 versions']}))
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest('./public/css'));
});

gulp.task('minify', function() {
  return gulp.src(paths.minify)
    .pipe(cssmin())
    .pipe(concat('all.css'))
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('./public/css'))
    .pipe(livereload());
});

gulp.task('views', function() {
  return gulp.src(paths.views)
    .pipe(livereload());
});

gulp.task('watch', function() {
  gulp.watch(paths.scripts, ['scripts']);
  gulp.watch(paths.images, ['images']);
  gulp.watch(paths.css, ['css']);
  gulp.watch(paths.minify, ['minify']);
  gulp.watch(paths.views, ['views']);
});

gulp.task('start', function(){
  //exec("npm start", puts);
  nodemon({ script: paths.main, ignore: '*.*' })
    .on('restart', function () {
      console.log('you should reload now');
      livereload().changed(paths.main);
    })
});

/* REQUIRES npm-check-updates globally installed! 'npm i -g npm-check-updates' */
gulp.task('update', function(){
  exec("npm-check-updates -u", puts);
});

gulp.task('mongodb', function(){
  exec('"C:/Program Files/MongoDB 2.6 Standard/bin/mongod.exe" --dbpath ' + __dirname + '/mongodb', puts);
});

gulp.task('default', ['watch', 'scripts', 'css', 'minify', 'images']);
gulp.task('dev_nodb', ['start', 'default']);
gulp.task('dev', ['start', 'mongodb', 'default']);
