// module.exports = {
//     setupproject: function(pathtoprojectzip) {
//         if (fs.existsSync(pathtoprojectzip)) {
//             console.log("Project exists, %s", pathtoprojectzip);

//             console.log("Setting up print directory, %s", printpath);
//             mkprintdir();



//             console.log("Unzipping project to %s", printpath);
//             unzipproject(pathtoprojectzip);

//         }
//     },

// };


var fs = require("fs"),
    path = require("path"),
    exec = require('child_process').exec,
    unzip = require('unzip');

var appRoot = path.resolve("./");
var printpath = path.join(appRoot, "print");
var debug = true;

//getFiles(appRoot);
getProjectSliceType();

if (debug) {
    console.log("\n********* Global Messages *********");
    console.log("debug is on");
    console.log("***********************************\n");
}

// getFiles(appRoot);
//getProjects(appRoot);
// getDirectories(appRoot);
// mkprintdir();
var testprojectzipfile = path.join(appRoot, "airesheadtest.zip");
// setupproject(testprojectzipfile);

    function setupproject(pathtoprojectzip) {
        if (fs.existsSync(pathtoprojectzip)) {
            console.log("Project exists, %s", pathtoprojectzip);

            console.log("Setting up print directory, %s", printpath);
            mkprintdir();



            console.log("Unzipping project to %s", printpath);
            unzipproject(pathtoprojectzip);

        }
    };

function unzipproject(pathtoprojectzip) {
    fs.createReadStream(pathtoprojectzip).pipe(unzip.Extract({
        path: printpath
    }));
}

function mkprintdir() {
    console.log(printpath);
    if (fs.existsSync(printpath)) {
        console.log("printpath exists, removing %s", printpath);
        exec('rm -r ' + printpath, function(err, stdout, stderr) {
            if (err != null) {
                console.log(err);
                console.log(stdout);
                console.log(stderr);
                console.log("Couldn't remove directory, %s", printpath);
            } else {
                console.log("Removed directory and all contents, %s", printpath);
                console.log("Creating directory, %s", printpath);
                fs.mkdir(printpath);
            }
        });
    } else {
        console.log("Creating directory, %s", printpath);
        fs.mkdir(printpath);
    }
}

function getProjects() {
    var f;
    fs.readdir(appRoot, function(err, files) {
        if (err) {
            throw err;
        }

        f = files.map(function(file) {
            return path.join(appRoot, file);
        }).filter(function(file) {
            return fs.statSync(file).isFile();
        }).filter(function(file) {
            return path.extname(file) == '.zip';
        });

        // f = files.filter(function(file){return path.extname(file)=='.zip';});

        if (debug) {
            // console.log("debug is on");

            console.log("********* Getting Projects *********");
            f.forEach(function(file) {
                console.log("%s (%s)", file, path.extname(file));
            });
            console.log("************************************\n");
        }


    });
    return f;

}


function getProjectSliceType(){
   var types = [];
   var f;
    fs.readdir(printpath, function(err, files) {
        if (err) {
            throw err;
        }

        f = files.map(function(file) {
            return path.join(printpath, file);
        }).filter(function(file) {
            return fs.statSync(file).isFile();
        }).filter(function(file) {
            return path.extname(file) != '.gcode';
        });


        if (debug) {
            console.log("********* Getting Types *********");
            f.forEach(function(file) {
                //console.log("%s (%s)", file, path.basename(file));
                if (types.indexOf(path.extname(file) == -1)){
                    // doesn't exist in the array, add the element
                    console.log("Couldn't find the ext, %s", path.extname(file));
                    types.push(path.extname(file));
                }
                
                

            });
            // types.forEach(function(fextname){
            //     console.log("Extension: %s", fextname);
            // });
            console.log(types.length);
            console.log("*********************************\n");
        }

    }); 

}

function getSlices(slicetype) {
    // slice type = '.png' or '.svg'
    var slices;
    fs.readdir(printpath, function(err, files) {
        if (err) {
            throw err;
        }

        slices = files.map(function(file) {
            return path.join(printpath, file);
        }).filter(function(file) {
            return fs.statSync(file).isFile();
        }).filter(function(file) {
            return path.extname(file) == slicetype;
        });


        if (debug) {
            console.log("********* Getting Projects *********");
            slices.forEach(function(file) {
                console.log("%s (%s)", file, path.basename(file, 'slicetype'));
            });
            console.log("*********************************\n");
        }

    });
}

function getDirectories(directory) {
    var d;
    fs.readdir(directory, function(err, files) {
        if (err) {
            throw err;
        }

        d = files.map(function(file) {
            return path.join(directory, file);
        }).filter(function(file) {
            return fs.statSync(file).isDirectory();
        });

        if (debug) {
            console.log("********* Getting Directories *********");

            d.forEach(function(file) {
                console.log("%s (%s)", file, path.dirname(file));
            });
            console.log("***************************************");

        }
    });
}
