var gulp        = require('gulp');
var sass        = require('gulp-sass');
var sassGlob    = require('gulp-sass-glob');
var Combine     = require('stream-combiner');
var postcss     = require('gulp-postcss');
var runSequence = require('run-sequence');
var rename      = require('gulp-rename');


var paths = {
	// SASS
	sassWatch:   'assets/scss/**/*.scss',
	sassCompile: ['assets/scss/*.scss', '!assets/scss/_*.scss'],
	sassOutput:  'assets/css',

	// JS stuff
	jsWatch:     'assets/source/**/*.js',
	jsCompile:   [
		//'assets/js-source/contrib/YOUR-FRAMEWORK-HERE.js',
		'assets/source/contrib/*',
		'assets/source/core/app.js',
		'assets/source/core/*.js',
		'assets/source/behaviours/*.js',
		'assets/source/handlers/*.js',
		'assets/source/app.js'
	],
	jsOutput:    'assets/js/',
};

// SASS compilation task
gulp.task('sass', function()
{
	var combined = Combine(
		gulp.src(paths.sassCompile),
        sassGlob(),
        sourcemaps.init(),
		sass({
            outputStyle: 'expanded'
        }),
        postcss([
            require('autoprefixer')({ browsers: [ 'last 2 versions' ]}),
            require('css-mqpacker')
        ]),
        sourcemaps.write(),
		gulp.dest(paths.sassOutput),
		postcss([
            require('postcss-sorting'),
            require('cssnano')({
                safe: true,
                autoprefixer: false,
                orderedValues: false
            })
        ]),
        rename({ suffix: '.min' }),
		gulp.dest(paths.sassOutput)
	);
	combined.on('error', function(err)
	{
		console.error(err.message);
	});

	return combined;
});

// JS munging
gulp.task('js', function()
{
	// var combined = Combine(
	// 	gulp.src(paths.jsCompile),
	// 	concat('scripts.js'),
	// 	gulp.dest(paths.jsOutput),
	// 	rename({ suffix: '.min' }),
	// 	uglify(),
	// 	gulp.dest(paths.jsOutput)
	// );
	// combined.on('error', function(err)
	// {
	// 	console.error(err.message);
	// })
});

// watch task
gulp.task('watch', function()
{
    gulp.watch(paths.sassWatch, ['sass']);
	// gulp.watch(paths.jsWatch,   ['js']  );
});

// void main(int *)   =]
gulp.task('default', function(fCb)
{
	runSequence(['sass', 'js'], 'watch', fCb);
});
