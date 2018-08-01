var gulp = require("gulp");
var ts = require("gulp-typescript");
var ext_replace = require('gulp-ext-replace');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify-es').default;
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var coffee = require("gulp-coffee");
var path = require("path");
var nearley = require('gulp-nearley');


var config = {
    node: {
        files: [
            "./source/Application.ts",
            "./source/module/*/**.ts",
            "./source/model/*.ts",
            "./source/service/*/**.ts"
        ],
        compilerOptions: {
            rootDir: "./source",
            target: "es2017",
            module: "commonjs",
            experimentalDecorators: true,
            alwaysStrict: true
        }
    },
    pug: {
        files: [
            "./source/layout/*/**.jade",
            "./source/module/*/**.jade"
        ]
    },
    sass: {
        files: [
            "./source/layout/*/style/**.sass",
            "./source/module/*/style/**.sass"
        ],
        compilerOptions: {
            outputStyle: 'compressed'
        }
    },
    jQuery: {
        files: [
            "./source/layout/*/script/**.coffee",
            "./source/module/*/script/**.coffee"
        ],
        compilerOptions: {
            bare: true
        }
    },
    python: {
        files: [
            "./source/service/math/*/**.py",
            "./source/service/math/*/**/***.py"
        ]
    },
    grammar: {
        files: [
            './source/module/*/script/**.ne'
        ]
    }
}

gulp.task("watch-node", function() {
    gulp.watch(config.node.files, function (event) {
        console.log('File:' + event.path + ' was ' + event.type + ', running tasks...');        
        gulp.src(event.path, {base: __dirname + "/source"})
            .pipe(ts(config.node.compilerOptions))
            .pipe(gulp.dest("dist"));
    });
});

gulp.task("watch-pug", function () {
    gulp.watch(config.pug.files, function(event) {
        console.log('File:' + event.path + ' was ' + event.type + ', running tasks...');
        gulp.src(event.path, {base: __dirname + "/source"})
            .pipe(ext_replace(".pug"))
            .pipe(gulp.dest("dist"));
    });
});

gulp.task("watch-sass", function () {
    gulp.watch(config.sass.files, function (event) {
        console.log('File:' + event.path + ' was ' + event.type + ', running tasks...');
        var ancestor = path.dirname(path.dirname(path.dirname(event.path)));
        if (ancestor === path.join(__dirname, "./source/layout"))
        {
            gulp.src(event.path, {base: ancestor})
                .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
                .pipe(rename({ suffix: '.min' }))
                .pipe(gulp.dest("./public/dist/layout"));
        }
        else
        {
            gulp.src(event.path, {base: ancestor})
                .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
                .pipe(rename({ suffix: '.min' }))
                .pipe(gulp.dest("./public/dist/pages"));
        }
    });
});

gulp.task("watch-jquery", function() {
    gulp.watch(config.jQuery.files, function (event) {
        console.log('File:' + event.path + ' was ' + event.type + ', running tasks...');
        var ancestor = path.dirname(path.dirname(path.dirname(event.path)));
        var parent = path.dirname(event.path).split(path.sep).reverse()[1];
        if (ancestor === path.join(__dirname, "./source/layout"))
        {
            gulp.src(path.join(path.dirname(event.path), "*.coffee"))
                .pipe(concat("index.coffee"))
                .pipe(coffee(config.jQuery.compilerOptions))
                .pipe(uglify())
                .pipe(rename({ suffix: '.min' }))
                .pipe(gulp.dest("./public/dist/layout/" + parent + "/script/"));
        }
        else
        {
            gulp.src(path.join(path.dirname(event.path), "*.coffee"))
                .pipe(concat("index.coffee"))
                .pipe(coffee(config.jQuery.compilerOptions))
                .pipe(uglify())
                .pipe(rename({ suffix: '.min' }))
                .pipe(gulp.dest("./public/dist/pages/" + parent + "/script/"));
        }
    })
});

gulp.task("watch-python", function () {
    gulp.watch(config.python.files, function(event) {
        console.log('File:' + event.path + ' was ' + event.type + ', running tasks...');
        gulp.src(event.path, {base: __dirname + "/source"})
            .pipe(gulp.dest("dist"));
    });
});

gulp.task("default", ["watch-node", "watch-pug", "watch-sass", "watch-jquery", "watch-python"]);