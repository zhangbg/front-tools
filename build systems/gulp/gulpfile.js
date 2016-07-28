var gulp = require('gulp'),
	jshint = require('gulp-jshint'),
	stylish = require('jshint-stylish'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	rename = require('gulp-rename'),
    minifycss = require('gulp-minify-css'),
	notify = require('gulp-notify'),
	del = require('del'),
    fs = require('fs'),
    replace = require('gulp-replace');

var paths = ['dist/PluginDetect_AllPlugins.js', 'dist/swfobject.js', 'dist/tracker.js'],
    gsPath = ['dist/gridsum_footer.js'], gsCssPath = ['dist/gridsum_footer.css'], 
    entryPath = ['dist/entry.js'], wrapperPath = ['dist/application-wrapper.js'];

gulp.task('buildTracker', function() {
	gulp.src(paths)
		// .pipe(jshint())
		// .pipe(jshint.reporter(stylish))
		.pipe(concat('tracker.js', {newLine : '\n\n'}))
		.pipe(uglify())
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest('build'))
        .pipe(notify({ message: 'The buildTracker task complete.' }));
});

gulp.task('buildScript', function() {
    gulp.src(gsPath)
        .pipe(concat('gridsum_footer.js', {newLine : '\n\n'}))
        .pipe(uglify())
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest('build'))
        .pipe(notify({ message: 'The buildScript task complete.' }));
});

gulp.task('buildCSS', function() {
    gulp.src(gsCssPath)
        .pipe(concat('gridsum_footer.css', {newLine : '\n\n'}))
        .pipe(minifycss())
        .pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest('build'))
		.pipe(notify({ message: 'The buildCSS task complete.' }));
});

gulp.task('minifyEntry', function () {
    return gulp.src(entryPath)
        .pipe(concat('entry.js', {newLine : '\n\n'}))
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('dist'));
});

gulp.task('buildWrapper', ['minifyEntry'], function() {
    var replacement = fs.readFileSync('./dist/entry.min.js', {encoding: 'utf8'}); 
    gulp.src(wrapperPath)
        .pipe(concat('application-嵌套模板.js', {newLine : '\n\n'}))
        .pipe(replace('//target', replacement))
		.pipe(gulp.dest('build'))
		.pipe(notify({ message: 'The buildWrapper task complete.' }));
});

gulp.task('clean', function () {
	return del(['build/tracker.min.js', 'build/gridsum_footer.min.js', 'build/gridsum_footer.min.css', 'build/application-嵌套模板.js']);
});

gulp.task('watch', function () {
    /* var watcher = gulp.watch(paths, ['clean', 'buildAssets']);
    watcher.on('change', function(event) {
        console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    }); */
	
    gulp.watch(paths, function (event) {
		console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
	});
	gulp.watch(paths, ['buildTracker']);  //'clean', 
	gulp.watch(gsPath, ['buildScript']);  //'clean', 
	gulp.watch(gsCssPath, ['buildCSS']);  //'clean', 
	gulp.watch(entryPath.concat(wrapperPath), ['buildWrapper']);  //'clean', 
    
});

gulp.task('default', ['clean'], function () {
	gulp.start('buildTracker', 'buildScript', 'buildCSS', 'buildWrapper', 'watch');
});

gulp.task('test', function () {
    gulp.src(['dist/tracker.js'])
		.pipe(jshint())
		.pipe(jshint.reporter(stylish))
		.pipe(concat('all.js', {newLine : '\n\n'}))
		.pipe(uglify())
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest('build'))
		.pipe(notify({ message: 'Scripts task complete' }));
});