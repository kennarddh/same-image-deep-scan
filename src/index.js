"use strict";
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var _a, e_1, _b, _c;
var _d;
Object.defineProperty(exports, "__esModule", { value: true });
var glob_1 = require("glob");
var fs_1 = require("fs");
var url_1 = require("url");
var path_1 = require("path");
var workerpool_1 = require("workerpool");
var __dirname = path_1.default.dirname((0, url_1.fileURLToPath)(import.meta.url));
var pool = workerpool_1.default.pool("".concat(__dirname, "/CreateImage.js"), {
    minWorkers: 5,
    maxWorkers: 10,
    workerType: 'thread',
});
console.log('Creating images');
console.time('Creating images done');
var imageFilesGlob = new glob_1.Glob('./data/**/*.{png,jpg,jpeg}', {});
var createImagePromises = [];
try {
    for (var _e = true, imageFilesGlob_1 = __asyncValues(imageFilesGlob), imageFilesGlob_1_1; imageFilesGlob_1_1 = await imageFilesGlob_1.next(), _a = imageFilesGlob_1_1.done, !_a; _e = true) {
        _c = imageFilesGlob_1_1.value;
        _e = false;
        var imagePath = _c;
        var exec = pool.exec('CreateImage', [imagePath]);
        createImagePromises.push(exec);
    }
}
catch (e_1_1) { e_1 = { error: e_1_1 }; }
finally {
    try {
        if (!_e && !_a && (_b = imageFilesGlob_1.return)) await _b.call(imageFilesGlob_1);
    }
    finally { if (e_1) throw e_1.error; }
}
var images = await Promise.all(createImagePromises);
pool.terminate();
console.timeEnd('Creating images done');
console.log("Found ".concat(images.length, " images"));
console.log('Checking duplicates');
console.time('Checking duplicates');
var imageMap = new Map();
for (var _i = 0, images_1 = images; _i < images_1.length; _i++) {
    var image = images_1[_i];
    var hexHash = image.hash.toString('hex');
    if (imageMap.has(hexHash)) {
        (_d = imageMap.get(hexHash)) === null || _d === void 0 ? void 0 : _d.push(image.path);
    }
    else {
        imageMap.set(hexHash, [image.path]);
    }
}
console.timeEnd('Checking duplicates');
console.log("Found ".concat(imageMap.size, " unique images and ").concat(images.length - imageMap.size, " redundant duplicated images."));
console.log('Writing output');
console.time('Writing output done');
var outputFileStream = fs_1.default.createWriteStream('./duplicateImages.txt');
for (var _f = 0, imageMap_1 = imageMap; _f < imageMap_1.length; _f++) {
    var _g = imageMap_1[_f], hash = _g[0], images_2 = _g[1];
    outputFileStream.write("".concat(hash, "\n").concat(images_2.join('\n'), "\n\n"));
}
outputFileStream.end();
console.timeEnd('Writing output done');
