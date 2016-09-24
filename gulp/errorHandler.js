var notify = require('gulp-notify');

module.exports = function(err)
{
    notify.onError({
        title:    "Frontend Boilerplate Notification",
        subtitle: "Error!",
        message:  "<%= error.message %> - <%= error.fileName %> - <%= error.lineNumber %>",
        sound:    "Beep"
    })(err);

    this.emit('end');
};
