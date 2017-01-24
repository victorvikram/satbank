# Sat Bank
This is the skeleton for a bank of SAT questions that can be searched through based on their topics (and eventually other attributes). It also generates a PDF with the questions you select.

## How to run it
In order to run the app, go through this steps once:
  1. Install NodeJS at nodejs.org
  2. Install MongoDB
     * On Windows: [link](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/)
     * On Mac: [link](http://treehouse.github.io/installation-guides/mac/mongo-mac.html)
  3. Install a Latex compiler like TexLive or MacTex (for Mac) that allows you to compile a latex document using `pdflatex your.tex` in the command line.
  4. In the "app" directory, type `npm install` into the command line. This should install the necessary dependencies.
  5. If it isn't on already, turn javascript on in the browser. This has likely already been done.
  6. Add files to the questions database. We will describe this further below.

And go through these steps every time you run the app:
  1. Start MongoDB (view instructions above).
  2. In the "app" directory, type `node app` into the command line.
  3. Go to localhost:6969 in the browser
  4. Use!
