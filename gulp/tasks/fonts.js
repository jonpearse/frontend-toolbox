// ==========================================================================
// # SASS functions
// ==========================================================================
let gulp    = require('gulp');
let rename  = require('gulp-rename');
let plumber = require('gulp-plumber');

// core includes
let paths        = require('../paths');
let errorHandler = require('../errorHandler');

/**
 * Copies fonts to the asset directory.
 */
gulp.task('fonts', () =>
{
    return  gulp.src( paths.fonts.source )
                .pipe(plumber({
                    errorHandler: errorHandler
                }))
                .pipe(rename((path) =>
                {
                    let sDir = path.dirname.toLowerCase();
                    let sFont = path.basename.toLowerCase();

                    // if the dir + font are different, add a prefix
                    if (sDir !== sFont)
                    {
                        path.basename = `${path.dirname}-${path.basename}`;
                    }

                    // always unset the dirname
                    path.dirname = '';
                }))
                .pipe(gulp.dest( paths.sass.output ));
});

// return hooks
module.exports = {
    init:  [ 'fonts' ],
    watch: {
        files: paths.fonts.watch,
        tasks: [ 'fonts' ]
    },
    build: [ 'fonts' ]
};
