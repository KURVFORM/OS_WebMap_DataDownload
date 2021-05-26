// Import dependencies, including the extract-zip module we installed with npm
const fs = require("fs");
const path = require("path");
const extract = require("extract-zip");
const getFilePaths = require("./getFilePaths.js");

async function unzipAll(dir) {
  dir = path.resolve(dir);

  // Create an array of all .zip file paths in the directory:
  let filepaths = getFilePaths(dir);
  filepaths = filepaths.filter((filepath) => path.extname(filepath) === ".zip");

  // Loop through filepaths, extracting and deleting each:
  while (filepaths.length > 0) {
    for (let file of filepaths) {
      let parsedpath = path.parse(file);
      let targetdir = path.resolve(parsedpath.dir);

      try {
        // Unzip the compressed file into a directory with the same name
        await extract(file, { dir: targetdir });
        await fs.unlinkSync(file); // <- delete the .zip file
        console.log("Unzipped", parsedpath.base + ", deleted .zip file.");
      } catch (err) {
        console.log(err);
      }
    }

    // If the extracted folders contained zipfiles, they'd be included here:
    filepaths = getFilePaths(dir);
    filepaths = filepaths.filter(
      (filepath) => path.extname(filepath) === ".zip"
    );
  }
}

// Since we'll be importing it into our main JS file, we export the function:
module.exports = unzipAll;