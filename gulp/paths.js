const ROOT   = require('path').resolve(`${__dirname}/..`);
const ASSETS = ROOT + '/assets';
const OUTPUT = ROOT + '/assets/dist';

// output
module.exports = {
    root:   ROOT,
    build:  OUTPUT,

    sass: {
        watch:   `${ASSETS}/scss/**/*.scss`,
        source: [ `${ASSETS}/scss/*.scss`, `!${ASSETS}/scss/_*.scss` ],
        output:  OUTPUT,

    },

    js: {
        watch:   `${ASSETS}/js/**/*.js`,
        context: `${ASSETS}/js`,
        compile: {
            app: `${ASSETS}/js/app.js`
        },
        output: OUTPUT
    },

    images: {
        watch:  `${ASSETS}/img/**/*`,
        source: `${ASSETS}/img/**/*.*`,
        output: OUTPUT
    },

    svg: {
        watch:  `${ASSETS}/icons/*.svg`,
        source: `${ASSETS}/icons/*.svg`,
        output: OUTPUT
    },

    fonts: {
        watch:  `${ASSETS}/fonts/**/*`,
        source: `${ASSETS}/fonts/**/*.*`,
        output: OUTPUT
    }
};
