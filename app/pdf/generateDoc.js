var fs = require('fs');
var exec = require('child_process').exec;

// latex header and footer
var docStart = fs.readFileSync("header.txt", "UTF-8");
var docEnd = "\\end{document}"

module.exports = {
  generate: function(pathArray) {
    // writes header to Tex file

    fs.writeFileSync("test.tex", docStart);

    // adds all images in pathArray to latex file
    for(img in pathArray) {
      var strToAdd = `\t\\addimage{${pathArray[img]}} \n`;
      addToFile(strToAdd);
    }

    // adds footer to file
    addToFile(docEnd);

    // creates pdf
    exec("pdflatex test.tex");
    return __dirname + "/test.pdf";
  }
};

// helper function to append to a file
function addToFile(str) {
    fs.appendFileSync("test.tex", str);
}
