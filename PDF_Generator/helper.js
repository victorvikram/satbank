var path = require('path');
var fs = require('fs')

module.exports = {
  chooseFile: function(subjectName, starterPath) {
    console.log(starterPath);
    var pathName = path.join(starterPath, subjectName);
    var files = fs.readdirSync(pathName.toString());
    var index = Math.floor(Math.random() * files.length);
    var filePath = path.join(__dirname, "Questions", subjectName, files[index]);
    return filePath;
  }
};
