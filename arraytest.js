// arraytest.js

var fs = require("fs"),
	path = require("path"),
	exec = require('child_process').exec,
	unzip = require('unzip');

var appRoot = path.resolve("./");
var printpath = path.join(appRoot, "print");
var debug = true;

var sliceType = '';
getProjectSliceType();
console.log("sliceType = %s", sliceType);
// var testcol = new Array();

// testcol.push("test");
// console.log(testcol.indexOf("test"));
// if (testcol.indexOf("test") > -1) {
// 	console.log("test exists in the array");
// } else {
// 	console.log("test doesn't exist in the collection");
// }

function getProjectSliceType() {
	
	fs.readdir(printpath, function(err, files) {
		if (err) {
			throw err;
		}

		var f = files.map(function(file) {
			return path.join(printpath, file);
		}).filter(function(file) {
			return fs.statSync(file).isFile();
		}).filter(function(file) {
			return path.extname(file) != '.gcode';
		}).filter(function(file) {
			return path.extname(file) == '.png' || path.extname(file) == '.zip';
		});


		var svg = false;
		var png = false;

		if (debug) {
			console.log("********* Getting Types *********");
			f.forEach(function(file) {
				//console.log("%s (%s)", file, path.basename(file));

				if (path.extname(file) === '.svg') {
					svg = true;
				} else if (path.extname(file) === '.png') {
					png = true;
				}

			});

			console.log("SVG = %s", svg);
			console.log("PNG = %s", png);
			console.log("*********************************\n");
		}

// return ext;// return ext;// return ext;
		if (svg && png) {
			throw "Unknown slice image type";
		} else if (svg) {
			sliceType = ".svg";
		} else if (png) {
			sliceType = ".png";
		}

		

	});
	
	
}
