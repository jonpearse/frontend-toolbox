// ==========================================================================
// # SVG functions
// ==========================================================================
var gulp     = require('gulp');
var plumber  = require('gulp-plumber');
var svgmin   = require('gulp-svgmin');
var svgstore = require('gulp-svgstore');
var rename   = require('gulp-rename');

// core includes
var paths        = require('../paths');
var errorHandler = require('../errorHandler');

/**
 * Compiles SVG icon sheet
 */
gulp.task('svg-icons', function()
{
    return  gulp.src( paths.svg.source )
                .pipe(plumber({
                    errorHandler: errorHandler
                }))
                .pipe(rename({ prefix: 'icon-' }))
                .pipe(svgstore())
                .pipe(svgmin({
                    plugins: [
                        { removeDoctype: true },
                        { cleanupIDs: false },
                        { removeStyleElement: true },
                        { removeTitle: true },
                        { removeAttrs: { attrs: [ 'style', 'stroke.*', 'class' ]}}
                    ]
                }))
                .pipe(rename( 'spritesheet.svg' ))
                .pipe(gulp.dest( paths.svg.output ));
});

// return hooks
module.exports = {
    init:  [ 'svg-icons' ],
    watch: {
        files: paths.svg.watch,
        tasks: [ 'svg-icons' ]
    },
    build: [ 'svg-icons' ],
};
