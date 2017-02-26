var path = require('path');
var root = path.resolve(__dirname+'/..');
var fs   = require('fs');

// load local file if there’s one to load
var localFile  = path.resolve('./paths.js');
var localPaths = (fs.existsSync(localFile)) ? require(localFile) : {};

// output
module.exports = require('deep-assign')({
    root: root,
    build: root+'/assets/dist',

    sass: {
        watch:   root+'/assets/scss/**/*.scss',
        source: [root+'/assets/scss/*.scss', '!'+root+'/scss/_*.scss'],
        output:  root+'/assets/css'

    },

    js: {
        watch:   root+'/assets/source/**/*.js',
        context: root+'/assets/source',
        compile: {
            app: 'assets/source/app.js'
        },
        output: root+'/assets/js'
    }

}, localPaths);
