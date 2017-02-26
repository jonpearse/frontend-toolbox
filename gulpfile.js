/* jshint strict:false */

// ==========================================================================
// # DEPENDENCIES
// ==========================================================================

// gulp
var gulp   = require('gulp');
var rev    = require('gulp-rev');
var revdel = require('gulp-rev-delete-original');
var del    = require('del');
var seq    = require('run-sequence');

// submodules
var modules = require('require-dir')('./gulp/tasks');

// ==========================================================================
// # PATHS
// ==========================================================================
var paths = require('./gulp/paths');

// ==========================================================================
// # TASKS
// ==========================================================================

// # INIT
// ==========================================================================
gulp.task('init', function(cb)
{
    forModules('init', runTasks, cb);
});

// # WATCH
// ==========================================================================
gulp.task('watch', function()
{
    forModules('watch', function(oWatchDefinition)
    {
        gulp.watch(oWatchDefinition.files, oWatchDefinition.tasks);
        return true;
    });
});

// # LINT
// ==========================================================================
gulp.task('lint', function(fCb)
{
    forModules('lint', runTasks, fCb);
});

// # BUILD
// ==========================================================================
gulp.task('build', [ 'clean' ], function(fCb)
{
    // 0. get some revision paths
    var aRevPaths = [ paths.build + '/*' ];

    // 1. add any exclusions from each module
    forModules('noRev', function(aExclude)
    {
        aExclude.forEach(function(sX)
        {
            aRevPaths.push('!' + paths.build + '/' + sX);
        });

        return true;
    });

    // 2. build everything
    forModules('build', runTasks, function()
    {
        gulp.src(aRevPaths)
            .pipe( rev() )
            .pipe( revdel() )
            .pipe( gulp.dest( paths.build ))
            .pipe( rev.manifest({
                path: 'manifest.json',
                merge: true
            }))
            .pipe( gulp.dest(paths.build))
            .on('end', fCb);
    });
});

// # CLEAN
// ==========================================================================
gulp.task('clean', function()
{
    return del.sync([
        paths.build + '/*.*',
    ]);
})

// # DEFAULT
// ==========================================================================
gulp.task('default', [ 'init', 'watch' ]);


// ==========================================================================
// # UTILITY FUNCTIONS
// ==========================================================================
/**
 * Utility function that iterates through included modules and returns the specified property for each.
 *
 * @param   sHook       the hook/property to return
 * @param   fnCallback  a callback function, into which the property’s value is passed
 * @param   fnComplete  function called when the whole thing has finished
 */
function forModules(sHook, fnCallback, fnComplete)
{
    // prepare callback hook
    var iToRun = 0;
    var bWaiting = false;
    function fnCheckComplete()
    {
        // decrement our counter
        iToRun--;

        // if we’re waiting and everything is done…
        if (bWaiting && (iToRun <= 0) && (fnComplete !== undefined))
        {
            fnComplete();
        }
    }

    // run everything
    Object.keys(modules).forEach(function(sModule)
    {
        // a. get the module
        var oModule = modules[sModule];

        // b. do we have a hook
        if (oModule[sHook] !== undefined)
        {
            iToRun++;

            if (!fnCallback(oModule[sHook], fnCheckComplete))
            {
                bWaiting = true;
            }
        }
    });

    // if we’re not waiting for anything
    if (!bWaiting)
    {
        if (fnComplete !== undefined)
        {
            fnComplete();
        }
        return true;
    }
    return false;
}

/**
 * Runs an array of gulp tasks
 */
function runTasks(aTasks, fnCallback)
{
    seq(aTasks, fnCallback);
    return false;
}
