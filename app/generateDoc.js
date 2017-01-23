var fs = require('fs');
var crypto = require('crypto');
var exec = require('child_process').exec;

// latex header and footer
var docStart = fs.readFileSync(__dirname + "/uploads/header.txt", "UTF-8");
var docEnd = "\\end{document}"

module.exports = {
  generate: function(pathArray, callback) {

    //Generate random file name
    crypto.pseudoRandomBytes(16, function (err, raw) {
      //Create random filename
      var origname = raw.toString('hex') + Date.now()
      var filename = __dirname + "/uploads/" + origname + '.tex';

      fs.writeFileSync(filename, docStart);
      // adds all images in pathArray to latex file
      for(img in pathArray) {
        var strToAdd = `\t\\addimage{${pathArray[img]}} \n`;
        addToFile(strToAdd, filename);
      }

      // adds footer to file
      addToFile(docEnd, filename);
      /* console.log("pdflatex " + filename, {cwd: __dirname + "/uploads"}, function(error, stdout, stderr) {
        callback(__dirname + "/uploads/" + origname + ".pdf");
      } );*/
      exec("pdflatex " + filename, {cwd: __dirname + "/uploads"}, function(error, stdout, stderr) {
        if(error) {
          console.log("ERROR MAKING THE PDF!");
        }
        callback(__dirname + "/uploads/" + origname + ".pdf");
      });
    });

  }
};

// helper function to append to a file
function addToFile(str, fname) {
    fs.appendFileSync(fname, str);
}
