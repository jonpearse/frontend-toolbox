// ==========================================================================
// # SASS functions
// ==========================================================================
const gulp    = require('gulp');
const plumber = require('gulp-plumber');
const webpack = require('webpack-stream');
const rename  = require('gulp-rename');
const uglify  = require('gulp-uglify');
const eslint  = require('gulp-eslint');

// core includes
const paths        = require('../paths');
const errorHandler = require('../errorHandler');

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
            },
            {
                test: /\.json$/,
                loader: 'json'
            },
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
    let conf = WEBPACK_CONF;
    conf.devtool = 'inline-source-map';

    return  gulp.src( paths.js.context )
                .pipe(plumber({
                    errorHandler: errorHandler
                }))
                .pipe(webpack(conf))
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
