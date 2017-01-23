var generateDoc = require('./generateDoc');

var paths = ["a.png", "b.png", "c.png"];

var location = generateDoc.generate(paths);

// prints location of pdf
console.log(location);
