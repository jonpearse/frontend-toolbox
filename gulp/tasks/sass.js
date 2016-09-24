// ==========================================================================
// # SASS functions
// ==========================================================================
var gulp         = require('gulp');
var plumber      = require('gulp-plumber');
var sass         = require('gulp-sass');
var sassGlob     = require('gulp-sass-glob');
var postcss      = require('gulp-postcss');
var rename       = require('gulp-rename');
var scsslint     = require('gulp-scss-lint');

// core includes
var paths        = require('../paths');
var errorHandler = require('../errorHandler');

// SASS compilation
gulp.task('sass', function()
{
    return  gulp.src( paths.sass.source )
                .pipe(plumber({
                    errorHandler: errorHandler
                }))
                .pipe(sassGlob())
                .pipe(sass({
                    outputStyle:  'expanded'
                }))
                .pipe(postcss([
                    require('autoprefixer')({ browsers: [ 'last 2 versions' ]}),
                    require('css-mqpacker')({ sort: true })
                ]))
                .pipe(gulp.dest( paths.sass.output ))
                .pipe(postcss([
                    require('postcss-sorting'),
                    require('cssnano')({
                        safe: true,
                        autoprefixer: false,
                        orderedValues: false
                    })
                ]))
                .pipe(rename({ suffix: '.min' }))
                .pipe(gulp.dest( paths.sass.output ));
});

// SASS linting
gulp.task('sass-lint', function() {
    return  gulp.src( paths.sass.watch )
                .pipe(plumber({
                    errorHandler: errorHandler
                }))
                .pipe( scsslint({
                    'config': paths.root+'/.scss-lint.yml',
                    'bundleExec': true
                }));
});

// Watch task
gulp.task('sass-watch', [ 'sass', 'sass-lint' ])
