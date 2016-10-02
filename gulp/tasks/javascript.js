// ==========================================================================
// # SASS functions
// ==========================================================================
var gulp         = require('gulp');
var plumber      = require('gulp-plumber');
var webpack      = require('webpack-stream');
var rename       = require('gulp-rename');
var uglify       = require('gulp-uglify');

// core includes
var paths        = require('../paths');
var errorHandler = require('../errorHandler');

// JS compilation
gulp.task('js', function()
{
    return  gulp.src( paths.js.context )
                .pipe(plumber({
                    errorHandler: errorHandler
                }))
                .pipe(webpack({
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
                                loader: 'babel',
                                query: {
                                    presets: ['es2015'],
                                    plugins: ['transform-object-assign']
                                }
                            }
                        ],
                    },
                    output:  { filename: '[name].js' }
                }))
                .pipe(gulp.dest( paths.js.output ))
                .pipe(uglify({
                    output: {
                        max_line_len: 120
                    },
                    compress: {
                        drop_console: true
                    }
                }))
                .pipe(rename({ suffix: '.min' }))
                .pipe(gulp.dest( paths.js.output ));
});

// watch task
gulp.task('js-watch', [ 'js' ]);
