var gulp        = require('gulp');
var sass        = require('gulp-sass');
var sassGlob    = require('gulp-sass-glob');
var Combine     = require('stream-combiner');
var postcss     = require('gulp-postcss');
var runSequence = require('run-sequence');
var rename      = require('gulp-rename');
var sourcemaps  = require('gulp-sourcemaps');
var scsslint    = require('gulp-scss-lint');


var paths = {
	// SASS
    sass: {
        watch:   'assets/scss/**/*.scss',
        compile: ['assets/scss/*.scss', '!assets/scss/_*.scss'],
        output:  'assets/css'
    },

    // JS
    js: {
        watch:   'assets/source/**/*.js',
        compile: [
            'assets/source/contrib/YOUR-FRAMEWORK-HERE.js',
            'assets/source/core/app.js',
            'assets/source/core/*.js',
            'assets/source/handlers/*.js',
    		'assets/source/app.js'
        ],
        output:  'assets/js/'
    }
};

// SASS compilation task
gulp.task('sass', function()
{
	var combined = Combine(
		gulp.src(paths.sass.compile),
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
		gulp.dest(paths.sass.output),
		postcss([
            require('postcss-sorting'),
            require('cssnano')({
                safe: true,
                autoprefixer: false,
                orderedValues: false
            })
        ]),
        rename({ suffix: '.min' }),
		gulp.dest(paths.sass.output)
	);
	combined.on('error', function(err)
	{
		console.error(err.message);
	});

	return combined;
});

// SASS linting
gulp.task('sasslint', function()
{
    return  gulp.src(paths.sass.watch)
                .pipe(scsslint({
                   'config': './.scss-lint.yml',
                   'bundleExec': true
                }));

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
    gulp.watch(paths.sass.watch, ['sass', 'sasslint']);
	// gulp.watch(paths.jsWatch,   ['js']  );
});

// void main(int *)   =]
gulp.task('default', function(fCb)
{
	runSequence(['sass', 'js'], 'watch', fCb);
});
