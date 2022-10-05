'use strict';
let { series, watch, src, dest } = require('gulp'),
    pug = require('gulp-pug'),
    sass = require('gulp-sass')(require('sass')),
    plumber = require('gulp-plumber'),
    plumberNotifier = require('gulp-plumber-notifier'),
    changed = require('gulp-changed'),
    sourcemaps = require('gulp-sourcemaps'),
    browserSync = require('browser-sync').create(),
    gulpif = require('gulp-if'),
    wait = require('gulp-wait');


// configurations
let gulpConfig = require('./gulp.config'),
    srcs = gulpConfig.paths.srcs,
    dists = gulpConfig.paths.dists,
    lang = gulpConfig.lang;

// if singleFile = true it will work as single file converter
function html(lang, dist, singleFile) {
    return src(srcs.pug)
        .pipe(gulpif(singleFile, changed(dists.html, {extension: '.html'})))
        .pipe(plumber())
        .pipe(plumberNotifier())
        .pipe(pug({
            pretty: true,
            data: {
                lang: lang.name,
                langDir: lang.direction,
                baseUrl: lang.baseUrl,
            }
        }))
        .pipe(dest(dist))
        .pipe(gulpif(singleFile, browserSync.stream()))
        .on('error', function(err) {
            console.log(err)
        });
}
function viewsAll (cb) {
    html(lang.default, dists.html);
    // check if secondary language is active
    if(lang.secondary.active) html(lang.secondary, dists.html + lang.secondary.name);
    cb();
}
function viewsSingle(cb) {
    html(lang.default, dists.html, true);
    // check if secondary language is active
    if(lang.secondary.active) html(lang.secondary, dists.html + lang.secondary.name, true);
    cb();
}

function style() {
    return src(srcs.scssMain)
        .pipe(wait(1))
        .pipe(sourcemaps.init())
        .pipe(plumber())
        .pipe(plumberNotifier())
        .pipe(sass())
        .pipe(sourcemaps.write('.'))
        .pipe(dest(dists.css))
        .pipe(browserSync.stream())
}

exports.default = series (
    viewsAll,
    style,
    function() {
        browserSync.init({
            server: {
                baseDir: dists.html
            }
        });
        watch(srcs.pug, { queue: false }, viewsSingle);
        watch(srcs.pugIncludes, { queue: false }, viewsAll);
        watch(srcs.scssWatch, { queue: false }, style);
    }
)