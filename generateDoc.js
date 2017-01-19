var fs = require('fs');
var readline = require('readline');

// latex header and footer
var docStart = "\\documentclass{article}\n\n\\usepackage{tgadventor}\n\\usepackage{changepage}\n\\usepackage{geometry}\n\\usepackage[utf8]{inputenc}\n\\usepackage{float} \n\\usepackage{pgfplots}\n\\usepackage{setspace}\n\\usepackage{vwcol} \n\\usepackage{tikz} \n\n\\newcommand{\\addimage}[1]{\n\t\\begin{figure}[h]\n\t\t\\includegraphics[width=\\linewidth]{#1} \n\t\\end{figure}\n\t\\newpage\n}\n\n\\begin{document}\n"
var docEnd = "\\end{document}"

// writes the header to the file
fs.writeFile("test.txt", docStart, function(err) {
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

rl.on('close', function() {
   console.log("%j", subjects);

   // inserts image commands into latex file based on the user's input
   for(s in subjects) {
     fs.appendFile("test.txt", `\t\\addimage{"${subjects[s]}.jpg"} \n`, function(err) {
         if(err) {
             return console.log(err);
         }
         console.log("The file was saved!");
     });
   }

   fs.appendFile("test.txt", docEnd, function(err) {
       if(err) {
           return console.log(err);
       }
       console.log("The file was saved!");
    });
});
