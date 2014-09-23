
var fs = require("fs"),
    path = require("path"),
    exec = require('child_process').exec,
    unzip = require('unzip'),
    fse = require("fs-extra");


var appRoot = path.resolve("./");
var printpath = path.join(appRoot, "print");
var debug = true;


if (debug) {
    console.log("\n********* Global Messages *********");
    console.log("debug is on");
    console.log("***********************************\n");
}

// General routine

// get all the projects
getProjects(appRoot);

// select a project
var selectedProject = path.join(appRoot, "airesheadtest\.zip");

// setup the working directory for the selected project
setupproject(selectedProject);

// determine the sliceType
// var sliceType = getProjectSliceType();
// console.log("Slice type: %s", sliceType);

// get all of the slice files
var slices;


function filterFilesByExt(fileDir, files, fileExtension) {
    f = files.map(function(file) {
        return path.join(fileDir, file);
    }).filter(function(file) {
        return fs.statSync(file).isFile();
    }).filter(function(file) {
        return path.extname(file) == fileExtension;
    });
    return f;
}

function lsSync(directory) {
    return fs.readdirSync(directory);
}


function setupproject(pathtoprojectzip) {
    if (fs.existsSync(pathtoprojectzip)) {
        console.log("Project exists, %s", pathtoprojectzip);

        console.log("Setting up print directory, %s", printpath);
        // mkprintdir();
        fse.removeSync(printpath);
        fse.mkdirSync(printpath);



        console.log("Unzipping project to %s", printpath);
        unzipproject(pathtoprojectzip);

    }
};

function unzipproject(pathtoprojectzip) {
    fs.createReadStream(pathtoprojectzip).pipe(unzip.Extract({
        path: printpath
    })).on('close', getSlices);


}

function getProjects() {
    var f = lsSync(appRoot);

    var p = filterFilesByExt(appRoot, f, '.zip');

    if (debug) {
        // console.log("debug is on");

        console.log("********* Getting Projects *********");
        p.forEach(function(file) {
            console.log("%s (%s)", file, path.extname(file));
        });
        console.log("************************************\n");
    }
    // console.log(p.length);

    return p;
}

function getProjectSliceType() {
    var s = '';

    console.log("Getting files from: %s", printpath);
    var files = lsSync(printpath);

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
        s = ".svg";
    } else if (png) {
        s = ".png";
    }



    return s;
}

function getSlices() {
    // slice type = '.png' or '.svg'

    var sliceType = getProjectSliceType();
    // console.log(sliceType);
    var f = lsSync(printpath);

    console.log(sliceType);
    f.forEach(function(file) {
        if (path.extname(file) == '.gcode') {
            console.log("%s (%s)", file, path.extname(file));
        }
    });

    var p = filterFilesByExt(printpath, f, sliceType);

    if (debug) {
        console.log("********* Getting slices *********");
        p.forEach(function(file) {
            console.log("%s (%s)", file, path.extname(file));
        });
        console.log("************************************\n");
    }
    // console.log(p.size());

    return p;
}