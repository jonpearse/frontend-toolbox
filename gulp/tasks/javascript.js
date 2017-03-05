// ==========================================================================
// # SASS functions
// ==========================================================================
var gulp    = require('gulp');
var plumber = require('gulp-plumber');
var webpack = require('webpack-stream');
var rename  = require('gulp-rename');
var uglify  = require('gulp-uglify');
var eslint  = require('gulp-eslint');

// core includes
var paths        = require('../paths');
var errorHandler = require('../errorHandler');

/**
 * Defines a webpack configuration object. Do it once here to avoid having to replicate it in the compile and build
 * tasks.
 */
const WEBPACK_CONF = {
    entry:   paths.js.compile,
    resolve: {
        root: paths.root,
        modulesDirectories: [
            'node_modules',
            paths.js.context
        ]
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel-loader'
            }
        ],
    },
    output:  {
        filename: '[name].js',
        chunkFilename: 'chunk-[chunkhash].js'
    }
};

/**
 * Compiles JS into output files.
 */
gulp.task('js', function()
{
    return  gulp.src( paths.js.context )
                .pipe(plumber({
                    errorHandler: errorHandler
                }))
                .pipe(webpack(WEBPACK_CONF))
                .pipe(gulp.dest( paths.js.output ));
});

/**
 * Builds JS to production target
 */
gulp.task('js-build', function()
{
    return  gulp.src( paths.js.context )
                .pipe(plumber({
                    errorHandler: errorHandler
                }))
                .pipe(webpack(WEBPACK_CONF))
                .pipe(uglify({
                    output: {
                        max_line_len: 1024
                    },
                    compress: {
                        drop_console: true
                    }
                }))
                .pipe(gulp.dest( paths.build ));
});

/**
 * Runs a lint pass on the source JS
 */
gulp.task('js-lint', function()
{
    gulp.src( paths.js.watch )
        .pipe(eslint())
        .pipe(eslint.format());
})

// return hooks
module.exports = {
    init:  [ 'js' ],
    watch: {
        files: paths.js.watch,
        tasks: [ 'js', 'js-lint' ]
    },
    lint:  [ 'js-lint' ],
    build: [ 'js-build' ],
    noRev: [ 'chunk-*.js' ]
};
