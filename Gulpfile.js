var gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
	rename = require('gulp-rename'),
    minifycss = require('gulp-minify-css');


gulp.task('SassToCssSrc', function() {
    gulp.src('sass/**/*.scss')
        .pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest('./css/'))
		.pipe(rename({ suffix: '.min' }))
		.pipe(minifycss())
		.pipe(gulp.dest('./css/'))
});

//Watch task
gulp.task('default', function () {
    // Create LiveReload server
   
    gulp.watch('sass/**/*.scss', ['SassToCssSrc']);
    
});
