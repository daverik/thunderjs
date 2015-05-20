var gulp = require('gulp');

var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var browserify = require('gulp-browserify');
var watch = require('gulp-watch');
var sass = require('gulp-sass');

// JS concat, strip debugging and minify
gulp.task('scripts', function(done) {
    gulp.src(['./src/thunder.js'])        
        .pipe(browserify({
            insertGlobals: true,
            standalone: 'Thunder',
            debug: !gulp.env.production
        }))
        // .pipe(uglify())
        .pipe(gulp.dest('dist'))

});

gulp.task('watch', function() {
    gulp.src(['./src/*.js'])
    .pipe(watch('./src/*.js', ['scripts']))
});


gulp.task('default', ['scripts', 'watch']);