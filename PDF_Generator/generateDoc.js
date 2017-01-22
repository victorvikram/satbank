var fs = require('fs');
var readline = require('readline');
var exec = require('child_process').exec;
var path = require('path');
var helper = require('./helper')

// latex header and footer
// var docStart = "\\documentclass{article}\n\n\\usepackage{tgadventor}\n\\usepackage{changepage}\n\\usepackage{geometry}\n\\usepackage[utf8]{inputenc}\n\\usepackage{float} \n\\usepackage{pgfplots}\n\\usepackage{setspace}\n\\usepackage{vwcol} \n\\usepackage{tikz} \n\n\\newcommand{\\addimage}[1]{\n\t\\begin{figure}[h]\n\t\t\\includegraphics[width=\\linewidth]{#1} \n\t\\end{figure}\n\t\\newpage\n}\n\n\\begin{document}\n"
var docEnd = "\\end{document}"
var starterPath = __dirname + "/Questions";

// writes the header to the file
var docStart = fs.readFileSync("header.txt", "UTF-8");
fs.writeFile("test.tex", docStart, function(err) {
    if(err) {
        return console.log(err);
    }
    console.log("The file was saved!");
});

// sets up readline interface
var subjects = [];
var rl = readline.createInterface(process.stdin, process.stdout);
rl.setPrompt("What subject do you want to include on the document?");
rl.prompt()

rl.on('line', function(subject) {
  rl.setPrompt("What others subjects do you want to include on the document? (if done, type 'finish')");
  if(subject.toLowerCase().trim() === 'finish') {
    rl.close();
  } else {
    subjects.push(subject);
    rl.prompt();
  }
});

var questionPaths = [];
rl.on('close', function() {
   console.log("%j", subjects);

   // inserts image commands into latex file based on the user's input
   for(s in subjects) {
     questionPaths.push(helper.chooseFile(subjects[s], starterPath));
   }

   for(img in questionPaths) {
     fs.appendFileSync("test.tex", `\t\\addimage{${questionPaths[img]}} \n`);
   }

   fs.appendFile("test.tex", docEnd, function(err) {
       if(err) {
           return console.log(err);
       }
       console.log("The file was saved!");
    });

    exec("pdflatex test.tex");
});
