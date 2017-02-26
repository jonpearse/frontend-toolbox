// ==========================================================================
// # SASS functions
// ==========================================================================
var gulp     = require('gulp');
var plumber  = require('gulp-plumber');
var sass     = require('gulp-sass');
var sassGlob = require('gulp-sass-glob');
var postcss  = require('gulp-postcss');
var rename   = require('gulp-rename');
var scsslint = require('gulp-scss-lint');

// core includes
var paths        = require('../paths');
var errorHandler = require('../errorHandler');

/**
 * Compiles SASS to dev build.
 */
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
                .pipe(gulp.dest( paths.sass.output ));
});

/**
 * Cleans compiled SASS to production build.
 */
gulp.task('sass-build', [ 'sass' ], function()
{
    return  gulp.src( paths.sass.output + '/*.css' )
                .pipe(postcss([
                    require('postcss-sorting'),
                    require('cssnano')({
                        safe: true,
                        autoprefixer: false,
                        orderedValues: false
                    })
                ]))
                .pipe(gulp.dest( paths.build ));
})

/**
 * Runs a lint task
 */
gulp.task('sass-lint', function()
{
    return  gulp.src( paths.sass.watch )
                .pipe(plumber({
                    errorHandler: errorHandler
                }))
                .pipe( scsslint({
                    'config': paths.root+'/.scss-lint.yml',
                    'bundleExec': true
                }));
});

// return hooks
module.exports = {
    init:  [ 'sass' ],
    watch: {
        files: paths.sass.watch,
        tasks: [ 'sass', 'sass-lint' ]
    },
    lint:  [ 'sass-lint' ],
    build: [ 'sass-build' ],
    noRev: [ 'critical*.css' ]
};
