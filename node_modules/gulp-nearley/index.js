
var PluginError = require("gulp-util").PluginError,
    compileGrammar = require("nearley-loader"),
    through = require("through2");

module.exports = function gulpNearley () {
  return through.obj(function (file, encoding, callback) {

    if (file.isNull()) return callback(null, file);

    if (file.isStream()) throw new PluginError("gulp-nearly", "Streaming not supported");

    var fileContents = file.contents.toString(encoding);

    var compiled = compileGrammar(fileContents);

    file.contents = Buffer.from(compiled, encoding);
    file.path = (file.path || "").replace(/.ne$/, ".js");

    this.push(file);

    callback();
  });
};

