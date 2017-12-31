// ==========================================================================
// # SASS functions
// ==========================================================================
let gulp     = require('gulp');
let imagemin = require('gulp-imagemin');
let plumber  = require('gulp-plumber');

// core includes
let paths        = require('../paths');
let errorHandler = require('../errorHandler');

/**
 * Copies fonts to the asset directory.
 */
gulp.task('imagemin', () =>
{
    return  gulp.src( paths.images.source )
                .pipe(plumber({ errorHandler: errorHandler }))
                .pipe(imagemin())
                .pipe(gulp.dest( paths.images.output ));
});

// return hooks
module.exports = {
    init:  [ 'imagemin' ],
    watch: {
        files: paths.images.watch,
        tasks: [ 'imagemin' ]
    },
    build: [ 'imagemin' ]
};
