var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var header = require('gulp-header');
var cleanCSS = require('gulp-clean-css');
var rename = require("gulp-rename");
var uglify = require('gulp-uglify');
var pkg = require('./package.json');

// Set the banner content
var banner = ['/*!\n',
    ' * Start Bootstrap - <%= pkg.title %> v<%= pkg.version %> (<%= pkg.homepage %>)\n',
    ' * Copyright 2013-' + (new Date()).getFullYear(), ' <%= pkg.author %>\n',
    ' * Licensed under <%= pkg.license.type %> (<%= pkg.license.url %>)\n',
    ' */\n',
    ''
].join('');


// Minify compiled CSS
gulp.task('minify-css', function() {
    return gulp.src(['src/style/*.scss'])
        .pipe(sass())
        .pipe(cleanCSS({ compatibility: 'ie8' }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('dist/css'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

// Minify JS
gulp.task('minify-js', function() {
    return gulp.src('src/js/*.js')
        .pipe(uglify())
        .pipe(header(banner, { pkg: pkg }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('dist/js'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

// Copy vendor libraries from /node_modules into /vendor
//gulp.task('copy', function() {
//    gulp.src(['node_modules/bootstrap/dist/**/*', '!**/npm.js', '!**/bootstrap-theme.*', '!**/*.map'])
 //       .pipe(gulp.dest('vendor/bootstrap'))
//
//    gulp.src(['node_modules/jquery/dist/jquery.js', 'node_modules/jquery/dist/jquery.min.js'])
//        .pipe(gulp.dest('vendor/jquery'))
//
//    gulp.src([
//            'node_modules/font-awesome/**',
//            '!node_modules/font-awesome/**/*.map',
//           '!node_modules/font-awesome/.npmignore',
//            '!node_modules/font-awesome/*.txt',
//            '!node_modules/font-awesome/*.md',
//            '!node_modules/font-awesome/*.json'
//        ])
//        .pipe(gulp.dest('vendor/font-awesome'))
//})


gulp.task('copy',function() {
   gulp.src(['src/*.html',])
     .pipe(gulp.dest('dist'))
   
   gulp.src('src/style/vendor/**/*')
     .pipe(gulp.dest('dist/vendor'))

   gulp.src('src/img/**/*')
     .pipe(gulp.dest('dist/img'))

})

// Run everything
gulp.task('default', ['minify-css', 'minify-js', 'copy']);

// Configure the browserSync task
gulp.task('browserSync', function() {
    browserSync.init({
        server: {
            baseDir: 'dist/'
        },
    })
})

// Dev task with browserSync
gulp.task('dev', ['browserSync','copy', 'minify-css', 'minify-js'], function() {
    //compile and minifies css and js
    gulp.watch(['src/*.html','src/img/*/','vendor/*/'],['copy']);
    gulp.watch('src/style/*.scss', ['minify-css']);
    gulp.watch('src/js/*.js', ['minify-js']);
    // Reloads the browser whenever HTML or JS files change
    gulp.watch('dist/*.html', browserSync.reload);
    gulp.watch('dist/js/**/*.js', browserSync.reload);
});
