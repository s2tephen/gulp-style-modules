'use strict';

var through = require('through2');
var path = require('path');
var gutil = require('gulp-util');
var PLUGIN_NAME = 'gulp-style-modules';

module.exports = function(opts) {
    function namefn(file) {
        // path/to/filename.css -> filename-styles
        var filename = path.basename(file.path, path.extname(file.path));
        return file.path.indexOf('-') > -1 ? filename : filename + '-styles';
    }

    var fname = opts && opts.filename || namefn;
    var modid = opts && opts.moduleId || namefn;

    return through.obj(function (file, enc, cb) {

        if (file.isStream()) {
            return cb(new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported'));
        }
        if (file.isNull()) {
            return cb(null, file);
        }

        var filename = typeof fname === 'function' ? fname(file) : fname;
        var moduleId = typeof modid === 'function' ? modid(file) : modid;
        var dirname = path.dirname(file.path);

        var res = '<dom-module id="' + moduleId + '">\n' +
            '\t<template>\n' +
            '\t\t<style>\n' +
            '\t\t\t' + file.contents.toString('utf8') + '\n' +
            '\t\t</style>\n' +
            '\t</template>\n' +
            '</dom-module>';

        file.contents = new Buffer(res);
        file.path = path.join(dirname, filename) + '.html';

        return cb(null, file);
    });

};
